import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { Power } from "@/components/pages/status/powers/types";

const POWERS_COLLECTION = "powers";
const USERS_COLLECTION = "users";

export interface PowerServiceResult {
  success: boolean;
  powerId?: string;
  error?: string;
}

export class PowerService {
  /**
   * Salva um poder na biblioteca do usuário (normalização)
   */
  static async savePowerToLibrary(
    userId: string,
    power: Power,
  ): Promise<PowerServiceResult> {
    try {
      // Validação de Integridade
      if (!power.name || power.effects.length === 0) {
        throw new Error("Poder deve ter um nome e pelo menos um efeito.");
      }

      // Validar se cada efeito tem os campos obrigatórios (via fallback ou override)
      for (const effect of power.effects) {
        const opts = power.effectOptions?.[effect.id];
        const action = opts?.action || effect.action;
        const range = opts?.range || effect.range;
        const duration = opts?.duration || effect.duration;

        if (!action || !range || !duration) {
          throw new Error(`Efeito ${effect.name} está incompleto (falta ação/alcance/duração).`);
        }
      }

      const userPowersRef = collection(
        db,
        USERS_COLLECTION,
        userId,
        POWERS_COLLECTION
      );
      
      const powerId = power.id || crypto.randomUUID();
      const powerRef = doc(userPowersRef, powerId);

      // Limpar campos undefined para o Firestore de forma segura
      const cleanData = (data: unknown): unknown => {
        if (data === null || typeof data !== "object") return data;
        
        // Mantém objetos especiais (Dates, Firestore FieldValues)
        if (data.constructor !== Object && !Array.isArray(data)) return data;

        if (Array.isArray(data)) return data.map(cleanData);
        
        const cleaned: Record<string, unknown> = {};
        const obj = data as Record<string, unknown>;
        
        Object.keys(obj).forEach(key => {
          if (obj[key] !== undefined) {
            cleaned[key] = cleanData(obj[key]);
          }
        });
        return cleaned;
      };

      const powerData = cleanData({
        ...power,
        id: powerId,
        updatedAt: serverTimestamp(),
      }) as Record<string, unknown>;

      await setDoc(powerRef, powerData, { merge: true });

      return { success: true, powerId };
    } catch (error) {
      console.error("Erro ao salvar poder na biblioteca:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      };
    }
  }

  /**
   * Remove uma imagem do Cloudinary (Rollback)
   */
  static async rollbackImage(publicId: string): Promise<void> {
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });
    } catch (error) {
      console.error("Erro ao realizar rollback de imagem:", error);
    }
  }

  /**
   * Faz upload da imagem de capa para o Cloudinary via nossa API
   */
  static async uploadPowerCover(
    file: File,
    previousPublicId?: string
  ): Promise<{ url: string; publicId: string } | null> {
    try {
      // 1. Converter arquivo para base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      // 2. Deletar imagem anterior se existir
      if (previousPublicId) {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: previousPublicId }),
        });
      }

      // 3. Upload novo
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64, // Corrigido: 'image' ao invés de 'file'
          folder: "midnight-blue/powers",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro detalhes Cloudinary:", errorData);
        throw new Error("Falha no upload para o Cloudinary");
      }

      const data = await response.json();
      // O endpoint retorna { ok: true, result: { secure_url, public_id ... } }
      return {
        url: data.result.secure_url,
        publicId: data.result.public_id,
      };
    } catch (error) {
      console.error("Erro no upload da capa do poder:", error);
      return null;
    }
  }
}

import { NextResponse } from "next/server";
import { adminAuth, adminDb, verifyIdToken } from "@/lib/firebaseAdmin";

/**
 * Helper para validar se o requisitante é ADMIN
 */
async function checkAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await verifyIdToken(token);
    return decoded.admin === true;
  } catch {
    return false;
  }
}

/**
 * PATCH - Altera status da conta (Admin, Congelar)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!(await checkAdmin(req))) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  try {
    const { isAdmin, disabled } = await req.json();
    const updates: Record<string, boolean> = {};

    // 1. Atualizar Custom Claims e Firestore para Admin
    if (typeof isAdmin === "boolean") {
      await adminAuth.setCustomUserClaims(userId, { admin: isAdmin });
      updates.isAdmin = isAdmin;
    }

    // 2. Atualizar Status de Desabilitado (Congelar)
    if (typeof disabled === "boolean") {
      await adminAuth.updateUser(userId, { disabled });
      updates.disabled = disabled;
    }

    if (Object.keys(updates).length > 0) {
      await adminDb
        .collection("users")
        .doc(userId)
        .set(updates, { merge: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AdminAPI] Error updating user:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Exclui a conta permanentemente
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!(await checkAdmin(req))) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  try {
    // 1. Excluir do Firebase Auth
    await adminAuth.deleteUser(userId);

    // 2. Excluir dados do Firestore (Recursivo opcional, aqui via batch simples ou delete doc)
    // Nota: O ideal seria deletar subcoleções, mas para MVP o doc principal e as
    // regras de segurança do Firebase impedirão acesso posterior se o Auth sumiu.
    // Deletamos o documento do usuário.
    await adminDb.collection("users").doc(userId).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AdminAPI] Error deleting user:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    );
  }
}

"use client";

import * as React from "react";
import {
  Mail,
  Shield,
  AlertTriangle,
  Download,
  Copy,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/custom/password-input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getClientAuth } from "@/lib/firebase";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { authSuccess, authError, authInfo } from "@/lib/toast";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import { calculatePasswordStrength } from "@/lib/password-utils";

export default function AccountSettingsForm() {
  const { user, refreshUser } = useAuth();
  const { uploading: uploadingAvatar, uploadAvatar } = useAvatarUpload();

  // Estados locais para formulário
  const [name, setName] = React.useState(user?.displayName || "");
  const [email, setEmail] = React.useState(user?.email || "");

  // Avatar upload preview
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
    user?.photoURL || null,
  );

  // Segurança
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Deleção de conta
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState("");

  const [sendingVerification, setSendingVerification] = React.useState(false);
  const [checkingVerification, setCheckingVerification] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setAvatarPreview(user.photoURL || null);
    }
  }, [user]);

  const sendVerificationEmail = React.useCallback(async () => {
    if (!user || !user.email) return authError("Usuário não autenticado");
    if (user.emailVerified) return authInfo("E-mail já verificado");

    try {
      setSendingVerification(true);
      const auth = getClientAuth();
      const current = auth.currentUser;
      if (!current) return authError("Usuário não autenticado");

      await sendEmailVerification(current);
      authSuccess(
        "E-mail de verificação enviado. Verifique sua caixa de entrada.",
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      authError("Erro ao enviar e-mail de verificação: " + message);
    } finally {
      setSendingVerification(false);
    }
  }, [user]);

  const checkVerificationStatus = React.useCallback(async () => {
    if (!user) return authError("Usuário não autenticado");

    try {
      setCheckingVerification(true);
      const auth = getClientAuth();
      const current = auth.currentUser;
      if (!current) return authError("Usuário não autenticado");

      await current.reload();
      refreshUser?.();

      if (auth.currentUser?.emailVerified) {
        authSuccess("E-mail verificado com sucesso!");
      } else {
        authInfo(
          "E-mail ainda não verificado. Verifique sua caixa de entrada e confirme o link.",
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      authError("Erro ao checar verificação: " + message);
    } finally {
      setCheckingVerification(false);
    }
  }, [user, refreshUser]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview local imediatamente
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(file);

    // Upload automático para Cloudinary (deletando anterior)
    const result = await uploadAvatar(file, user?.photoURL || null);
    if (result) {
      setAvatarPreview(result.secure_url);
    }
  }

  const passwordAnalysis = calculatePasswordStrength(newPassword);

  async function saveProfile() {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: name });
      authSuccess("Perfil atualizado com sucesso!");
      refreshUser?.();
    } catch (err) {
      authError(
        "Erro ao atualizar perfil: " +
          (err instanceof Error ? err.message : String(err)),
      );
    }
  }

  async function updatePassword() {
    if (!currentPassword) {
      authError("Por favor, informe sua senha atual.");
      return;
    }
    if (newPassword !== confirmPassword) {
      authError("As senhas não coincidem.");
      return;
    }
    if (passwordAnalysis.score < 3) {
      authError("A senha deve ser pelo menos 'Média' para sua segurança.");
      return;
    }
    // mock update
    setTimeout(() => {
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      authSuccess("Senha atualizada com sucesso!");
    }, 800);
  }

  function copyEmail() {
    if (!email) return;
    navigator.clipboard.writeText(email);
    authInfo("E-mail copiado para a área de transferência");
  }

  async function exportData() {
    const url = avatarPreview || user?.photoURL;
    if (!url) return authError("Nenhuma imagem disponível para download");

    try {
      let blob: Blob | null = null;

      if (url.startsWith("data:")) {
        // Converter data URL para Blob
        const parts = url.split(",");
        const meta = parts[0];
        const base64 = parts[1] || "";
        const mimeMatch = meta.match(/data:(.*);base64/);
        const mime = mimeMatch?.[1] || "image/png";
        const binary = atob(base64);
        const len = binary.length;
        const u8 = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          u8[i] = binary.charCodeAt(i);
        }
        blob = new Blob([u8], { type: mime });
      } else {
        // Tentar baixar remotamente (padrão Cloudinary)
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error("Falha ao baixar imagem");
          blob = await res.blob();
        } catch (fetchErr) {
          console.warn("Falha ao baixar imagem via fetch:", fetchErr);
          // Fallback: se fetch falhar por CORS, tentar download direto via <a>
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.rel = "noreferrer noopener";
          document.body.appendChild(a);
          a.click();
          a.remove();
          authInfo(
            "Abrindo imagem em nova aba para download (CORS pode impedir download automático)",
          );
          return;
        }
      }

      // Criar URL e forçar download
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        const ext = (blob.type.split("/")[1] || "png").split("+")[0];
        const filename = `avatar-${user?.uid || "user"}.${ext}`;
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
        authSuccess("Download iniciado");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      authError("Erro ao baixar imagem: " + message);
    }
  }

  function confirmDelete() {
    // mock delete
    setTimeout(() => {
      setDeleteOpen(false);
      authSuccess("Conta excluída (mock). Obrigado por testar.");
    }, 800);
  }

  return (
    <div className="grid gap-4 md:grid-cols-[320px_1fr]">
      {/* Left column: profile summary */}
      <div className="space-y-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Visão rápida do seu perfil</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-28 w-28 border-2 border-border">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} />
                ) : (
                  <AvatarFallback className="text-3xl">
                    {name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-background rounded-md p-1 shadow-sm min-w-max whitespace-nowrap">
                <Label className="text-xs">
                  {user?.emailVerified ? "Verificado" : "Não verificado"}
                </Label>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">{name || "Usuário"}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>

            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Alterar Foto"
                  )}
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </div>
              <Button
                variant="ghost"
                onClick={exportData}
                disabled={uploadingAvatar}
              >
                <Download className="mr-2" /> Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Utilitários rápidos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">ID do usuário</p>
                <p className="text-xs text-muted-foreground">
                  {user?.uid || "-"}
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={copyEmail}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copiar e-mail</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column: settings */}
      <div className="space-y-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Perfil Público</CardTitle>
            <CardDescription>
              Como os outros usuários verão você na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="display-name">Nome de Exibição</Label>
              <FormInput
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome ou apelido"
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 pt-4">
            <Button onClick={saveProfile}>Salvar Alterações</Button>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>
              Gerencie seu e-mail e verificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <FormInput
                    id="email"
                    type="email"
                    className="pl-8"
                    autoComplete="email"
                    value={email}
                    disabled
                  />
                </div>
                <Button variant="outline" onClick={copyEmail}>
                  Copiar
                </Button>
                {user?.emailVerified ? (
                  <Button
                    variant="outline"
                    className="text-green-500 border-green-500 cursor-default hover:text-green-500 hover:bg-transparent"
                  >
                    Verificado
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={sendVerificationEmail}
                      disabled={sendingVerification}
                    >
                      {sendingVerification ? "Enviando..." : "Verificar E-mail"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={checkVerificationStatus}
                      disabled={checkingVerification}
                    >
                      {checkingVerification ? "Checando..." : "Checar"}
                    </Button>
                  </>
                )}
              </div>
              {!user?.emailVerified && (
                <p className="text-[0.8rem] text-yellow-500">
                  Seu e-mail ainda não foi verificado.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>
              Atualize sua senha e medidas de segurança
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updatePassword();
            }}
            aria-label="Formulário de atualização de senha"
          >
            {/* Hidden/visually-hidden username field to aid password managers and accessibility */}
            <input
              id="account-username"
              name="username"
              type="text"
              autoComplete="username"
              value={email}
              readOnly
              aria-hidden="true"
              className="sr-only"
            />

            <CardContent className="space-y-4 pb-6">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Shield className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <FormInput
                    id="current-password"
                    type="password"
                    className="pl-8 pr-10"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <PasswordInput
                    id="new-password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <PasswordInput
                    id="confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-end">
                  <Label className="text-xs text-muted-foreground">
                    Força da Senha
                  </Label>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${passwordAnalysis.color.replace("bg-", "text-")} bg-muted`}
                  >
                    {passwordAnalysis.label}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 transition-all duration-500 ${
                        i < passwordAnalysis.score
                          ? passwordAnalysis.color
                          : "bg-border/30"
                      }`}
                    />
                  ))}
                </div>
                {newPassword && passwordAnalysis.feedback.length > 0 && (
                  <ul className="space-y-1 mt-1">
                    {passwordAnalysis.feedback.map((f, i) => (
                      <li
                        key={i}
                        className="text-[10px] text-muted-foreground flex items-center gap-1"
                      >
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>

            <CardFooter className="border-t px-6 pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Atualizar Senha
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Zona de Perigo
            </CardTitle>
            <CardDescription>
              Ações irreversíveis para sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ao excluir sua conta, todos os seus dados, personagens e itens
              serão permanentemente removidos.
            </p>
            <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
              <SheetTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2" />
                  Excluir Conta
                </Button>
              </SheetTrigger>

              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Confirmar exclusão da conta</SheetTitle>
                  <SheetDescription>
                    Digite &quot;EXCLUIR&quot; abaixo para confirmar. Esta ação
                    não pode ser desfeita.
                  </SheetDescription>
                </SheetHeader>

                <div className="p-4">
                  <FormInput
                    id="deleteConfirm"
                    name="deleteConfirm"
                    placeholder="Digite EXCLUIR para confirmar"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                  />
                </div>

                <SheetFooter>
                  <Button
                    variant="destructive"
                    disabled={deleteConfirm !== "EXCLUIR"}
                    onClick={confirmDelete}
                  >
                    Confirmar exclusão
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

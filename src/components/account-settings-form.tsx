"use client";

import * as React from "react";
import { Mail, Shield, AlertTriangle, Download, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { authSuccess, authError, authInfo } from "@/lib/toast";

export function AccountSettingsForm() {
  const { user } = useAuth();

  // Estados locais para formulário
  const [name, setName] = React.useState(user?.displayName || "");
  const [email, setEmail] = React.useState(user?.email || "");

  // Avatar upload preview
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(user?.photoURL || null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  // Segurança
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Deleção de conta
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState("");

  React.useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setAvatarPreview(user.photoURL || null);
    }
  }, [user]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function calculatePasswordStrength(pw: string) {
    let score = 0;
    if (!pw) return score;
    if (pw.length >= 8) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score; // 0-4
  }

  const strength = calculatePasswordStrength(newPassword);

  async function saveProfile() {
    setUploading(true);
    // mock save
    setTimeout(() => {
      setUploading(false);
      // substituir com integração real
      authSuccess("Perfil salvo com sucesso!");
    }, 800);
  }

  async function updatePassword() {
    if (newPassword !== confirmPassword) {
      authError("As senhas não coincidem.");
      return;
    }
    if (calculatePasswordStrength(newPassword) < 2) {
      authError("Senha muito fraca.");
      return;
    }
    // mock update
    setTimeout(() => {
      setNewPassword("");
      setConfirmPassword("");
      authSuccess("Senha atualizada com sucesso!");
    }, 800);
  }

  function copyEmail() {
    if (!email) return;
    navigator.clipboard.writeText(email);
    authInfo("E-mail copiado para a área de transferência");
  }

  function exportData() {
    authInfo("Exportação iniciada — você receberá um e-mail quando estiver pronta.");
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
                  <AvatarFallback className="text-3xl">{name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-background rounded-md p-1 shadow-sm min-w-max whitespace-nowrap">
                <Label className="text-xs">{user?.emailVerified ? "Verificado" : "Não verificado"}</Label>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">{name || "Usuário"}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>

            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Button variant="outline" className="w-full" onClick={() => document.getElementById('avatar-upload')?.click()}>Alterar Foto</Button>
                <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <Button variant="ghost" onClick={exportData}>
                <Download className="mr-2" /> Exportar
              </Button>
            </div>

            {avatarFile && (
              <div className="flex gap-2 w-full">
                <Button onClick={saveProfile} className="flex-1" disabled={uploading}>{uploading ? "Salvando..." : "Salvar Avatar"}</Button>
                <Button variant="outline" onClick={() => { setAvatarFile(null); setAvatarPreview(user?.photoURL || null); }}>Cancelar</Button>
              </div>
            )}
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
                <p className="text-xs text-muted-foreground">{user?.uid || "-"}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={copyEmail}><Copy className="h-4 w-4" /></Button>
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
            <CardTitle>Contato</CardTitle>
            <CardDescription>Gerencie seu e-mail e verificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-8" value={email} disabled />
                </div>
                <Button variant="outline" onClick={copyEmail}>Copiar</Button>
                {user?.emailVerified ? (
                  <Button variant="outline" className="text-green-500 border-green-500 cursor-default hover:text-green-500 hover:bg-transparent">Verificado</Button>
                ) : (
                  <Button variant="secondary">Verificar E-mail</Button>
                )}
              </div>
              {!user?.emailVerified && <p className="text-[0.8rem] text-yellow-500">Seu e-mail ainda não foi verificado.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Atualize sua senha e medidas de segurança</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <div className="relative">
                <Shield className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="current-password" type="password" className="pl-8 pr-10" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <PasswordInput id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <PasswordInput id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="h-1 bg-border rounded-md overflow-hidden">
                <div style={{ width: `${(strength / 4) * 100}%` }} className={`h-1 ${strength <= 1 ? "bg-red-500" : strength === 2 ? "bg-yellow-400" : "bg-green-400"}`} />
              </div>
              <p className="text-xs text-muted-foreground">Força: {strength}/4</p>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex gap-2">
            <Button variant="outline" onClick={updatePassword}>Atualizar Senha</Button>
            <Button onClick={saveProfile}>Salvar Alterações</Button>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Zona de Perigo</CardTitle>
            <CardDescription>Ações irreversíveis para sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Ao excluir sua conta, todos os seus dados, personagens e itens serão permanentemente removidos.</p>
            <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
              <SheetTrigger asChild>
                <Button variant="destructive"><Trash2 className="mr-2" />Excluir Conta</Button>
              </SheetTrigger>

              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Confirmar exclusão da conta</SheetTitle>
                  <SheetDescription>Digite &quot;EXCLUIR&quot; abaixo para confirmar. Esta ação não pode ser desfeita.</SheetDescription>
                </SheetHeader>

                <div className="p-4">
                  <Input placeholder="Digite EXCLUIR para confirmar" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} />
                </div>

                <SheetFooter>
                  <Button variant="destructive" disabled={deleteConfirm !== "EXCLUIR"} onClick={confirmDelete}>Confirmar exclusão</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

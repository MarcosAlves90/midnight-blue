"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authSuccess, authError } from "@/lib/toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      authError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      authError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const auth = getClientAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Atualiza displayName
      if (name) {
        try {
          await updateProfile(userCredential.user, { displayName: name });
        } catch (err) {
          console.warn("Não foi possível atualizar displayName", err);
        }
      }

      authSuccess("Conta criada com sucesso!");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      authError(message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Criar sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="midnight@exemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-l-none"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Esconder senha" : "Mostrar senha"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirmar Senha
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-l-none"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Esconder senha"
                            : "Mostrar senha"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </Field>
                </div>
                <FieldDescription>
                  Deve ter pelo menos 8 caracteres.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Conta"}
                </Button>
                <FieldDescription className="text-center">
                  Já tem uma conta? <Link href="/login">Entrar</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

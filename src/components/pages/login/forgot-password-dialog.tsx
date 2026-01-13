"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { authSuccess, authError } from "@/lib/toast";
import { getFirebaseErrorMessage } from "@/lib/firebase-errors";
import { sendPasswordResetEmail } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase";

export function ForgotPasswordDialog() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;

    setLoading(true);
    try {
      const auth = getClientAuth();
      await sendPasswordResetEmail(auth, email);
      authSuccess(
        "E-mail de redefinição enviado! Verifique sua caixa de entrada.",
      );
      setOpen(false);
      setEmail("");
    } catch (err: unknown) {
      console.error(err);
      authError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Esqueceu sua senha?
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar Senha</DialogTitle>
          <DialogDescription>
            Insira seu e-mail abaixo para receber um link de redefinição de
            senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="reset-email">E-mail</FieldLabel>
              <FormInput
                id="reset-email"
                type="email"
                placeholder="seu-email@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

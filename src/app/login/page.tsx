import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { AuthPageWrapper } from "@/components/auth-page-wrapper";

export const metadata: Metadata = {
  title: "Login",
  description: "Entre na sua conta para acessar suas fichas de RPG.",
};

export default function LoginPage() {
  return (
    <AuthPageWrapper>
      <LoginForm />
    </AuthPageWrapper>
  );
}

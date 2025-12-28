import type { Metadata } from "next";
import { Login } from "@/components/pages/login";
import { AuthPageWrapper } from "@/components/config/auth/auth-page-wrapper";

export const metadata: Metadata = {
  title: "Login",
  description: "Entre na sua conta para acessar suas fichas de RPG.",
};

export default function LoginPage() {
  return (
    <AuthPageWrapper>
      <Login />
    </AuthPageWrapper>
  );
}

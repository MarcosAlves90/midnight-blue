import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import { AuthPageWrapper } from "@/components/auth-page-wrapper";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie sua conta para começar sua jornada em MidNight.",
};

export default function SignupPage() {
  return (
    <AuthPageWrapper>
      <SignupForm />
    </AuthPageWrapper>
  );
}

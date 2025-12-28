import type { Metadata } from "next";
import { Signup } from "@/components/pages/signup";
import { AuthPageWrapper } from "@/components/config/auth/auth-page-wrapper";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie sua conta para começar sua jornada em MidNight.",
};

export default function SignupPage() {
  return (
    <AuthPageWrapper>
      <Signup />
    </AuthPageWrapper>
  );
}

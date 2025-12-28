import { Metadata } from "next";
import { Settings } from "@/components/pages/account";

export const metadata: Metadata = {
  title: "Configurações da Conta",
  description: "Gerencie suas informações de perfil e segurança.",
};

export default function AccountPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Settings />
    </div>
  );
}

import { redirect } from "next/navigation";

export default function NovoPersonagemPage() {
  // Redirecionar para galeria (agora sem query param para evitar loops)
  redirect("/dashboard/galeria");
}

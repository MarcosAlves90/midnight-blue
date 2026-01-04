"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ParallaxBackground from "@/components/ui/custom/parallax-background";
import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { useAuth } from "@/contexts/AuthContext";

interface AuthPageWrapperProps {
  children: React.ReactNode;
}

export function AuthPageWrapper({ children }: AuthPageWrapperProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  React.useEffect(() => {
    // Redireciona para o dashboard somente quando tivermos certeza sobre o estado de auth
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden">
      <ParallaxBackground
        src="https://res.cloudinary.com/dflvo098t/image/upload/login-page_tkiymv.gif"
        alt="Midnight Blue Background"
        intensity={8}
      />

      {/* Botão Voltar */}
      <div className="absolute top-4 left-4 z-20 md:top-8 md:left-8">
        <Button
          variant="ghost"
          asChild
          className="text-white/70 hover:text-white hover:bg-white/10 gap-2 px-2 md:px-4"
        >
          <Link href="/">
            <ChevronLeft className="size-4" />
            <span className="hidden md:inline">Voltar para o Início</span>
          </Link>
        </Button>
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-[family-name:var(--font-brevis)] text-3xl tracking-wide uppercase text-white hover:opacity-80 transition-opacity"
        >
          MidNight
        </Link>
        {children}
        <FieldDescription className="px-6 text-center text-white/50">
          Ao clicar em continuar, você concorda com nossos{" "}
          <a href="#" className="underline hover:text-white transition-colors">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="underline hover:text-white transition-colors">
            Política de Privacidade
          </a>
          .
        </FieldDescription>
      </div>
    </div>
  );
}

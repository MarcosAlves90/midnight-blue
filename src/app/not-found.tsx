"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GlitchText from "@/components/ui/custom/glitch-text";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Terminal, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [errorId, setErrorId] = useState<string>("");

  useEffect(() => {
    setErrorId(Math.random().toString(36).substring(7).toUpperCase());
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden p-6 text-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black tracking-tighter text-primary/5 select-none leading-none">
          404
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        <div className="mb-6 p-4 rounded-full bg-primary/5 border border-primary/10 animate-pulse">
          <FileQuestion className="h-16 w-16 text-primary" />
        </div>

        <div className="space-y-2 mb-8">
          <GlitchText
            className="text-4xl font-bold tracking-tighter sm:text-7xl text-primary uppercase"
            glitchChance={0.05}
          >
            Página Inexistente
          </GlitchText>
          <p className="text-muted-foreground text-sm sm:text-base font-mono uppercase tracking-widest opacity-70">
            [ Erro de Protocolo: Recurso Não Localizado ]
          </p>
        </div>

        <div className="bg-muted/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 mb-10 w-full max-w-md shadow-2xl shadow-primary/5">
          <p className="text-muted-foreground leading-relaxed mb-6">
            O endereço solicitado foi movido, deletado ou nunca existiu nos
            servidores da{" "}
            <span className="text-primary font-bold">Sevastopol</span>.
            Verifique suas credenciais ou retorne ao terminal seguro.
          </p>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full group border-primary/20 hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              VOLTAR PARA PÁGINA ANTERIOR
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                asChild
                variant="default"
                className="font-bold shadow-lg shadow-primary/20"
              >
                <Link href="/dashboard">
                  <Terminal className="mr-2 h-4 w-4" />
                  DASHBOARD
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  INÍCIO
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-40">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Status: 404_NOT_FOUND // ID: {errorId || "-------"}
          </div>
        </div>
      </div>

      {/* Scanline effect */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%]" />
    </div>
  );
}

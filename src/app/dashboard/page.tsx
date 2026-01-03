"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  PlusCircle, 
  Store, 
  BookOpen, 
  ChevronRight,
  Activity,
  Shield,
  Cpu,
  FileText,
  Terminal,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useCharacter } from "@/contexts/CharacterContext";
import { useGalleryState, useGalleryActions } from "@/components/pages/gallery/use-gallery";
import type { CharacterDocument } from "@/lib/character-service";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CharacterCard } from "@/components/pages/gallery/character-card";
import { NewCharacterDialog } from "@/components/pages/gallery/new-character-dialog";
import GlitchText from "@/components/ui/custom/glitch-text";

import { OperationsBulletin } from "@/components/pages/dashboard/operations-bulletin";
import { QuickActionLink } from "@/components/pages/dashboard/dashboard-cards";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedCharacter } = useCharacter();
  
  const { 
    characters, 
    setCharacters, 
    setFolders,
    isLoading, 
    setIsLoading, 
    setError, 
    dialogOpen,
    setDialogOpen, 
    deletingId,
    setDeletingId
  } = useGalleryState();

  const { 
    handleSelectCharacter, 
    handleDeleteCharacter, 
    listenToCharacters,
    listenToFolders
  } = useGalleryActions(
    user?.uid || null, 
    { setCharacters, setFolders, setError, setDeletingId, setSelectedCharacter }, 
    router.push
  );

  // Data Synchronization
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribeChars = listenToCharacters((chars) => {
      setCharacters(chars);
      setIsLoading(false);
    });

    const unsubscribeFolders = listenToFolders((folders) => {
      setFolders(folders);
    });

    return () => {
      unsubscribeChars();
      unsubscribeFolders();
    };
  }, [user?.uid, listenToCharacters, listenToFolders, setCharacters, setFolders, setIsLoading]);

  // Derived State
  const recentCharacters = [...characters]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  const userName = user?.displayName?.split(' ')[0] || 'OPERACIONAL';

  return (
    <div className="relative min-h-screen space-y-6 pb-10 animate-in fade-in duration-700 overflow-hidden">
      {/* Background Decorative Elements - Following Not Found Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 -z-10">
        <div className="absolute top-0 right-0 text-[15vw] font-black tracking-tighter text-primary/5 select-none leading-none uppercase italic">
          Sevastopol
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Scanline effect overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[size:100%_4px,3px_100%] opacity-20" />

      <div className="grid gap-6 items-stretch">
        <HeroSection 
          userName={userName} 
          onNewCharacter={() => setDialogOpen(true)} 
          onViewGallery={() => router.push('/dashboard/galeria')}
          bulletin={<OperationsBulletin embedded />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <section className="md:col-span-4 space-y-4">
          <SectionHeader 
            title="Dossiês Recentes" 
            actionLabel="Ver todos" 
            onAction={() => router.push('/dashboard/galeria')} 
          />
          
          <RecentDossiersList 
            isLoading={isLoading}
            characters={recentCharacters}
            onSelect={handleSelectCharacter}
            onDelete={handleDeleteCharacter}
            deletingId={deletingId}
            onStartFirstRecord={() => setDialogOpen(true)}
          />
        </section>

        <aside className="md:col-span-3 space-y-4">
          <div className="space-y-3">
            <h2 className="text-xl font-black tracking-tighter uppercase italic opacity-80">Protocolos</h2>
            <div className="grid gap-2">
              <QuickActionLink 
                href="/dashboard/loja" 
                icon={<Store className="h-5 w-5" />} 
                title="Arsenal & Tecnologia" 
                description="Equipamentos fornecidos pela Infinity Corp."
              />
              <QuickActionLink 
                href="/dashboard/wiki" 
                icon={<BookOpen className="h-5 w-5" />} 
                title="Base de Dados USC" 
                description="Arquivos históricos e diretrizes da Sevastopol."
              />
            </div>
          </div>
        </aside>
      </div>

      <NewCharacterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCharacterCreated={() => {}}
      />
    </div>
  );
}

// --- Sub-components for better organization ---

function HeroSection({ 
  userName, 
  onNewCharacter, 
  onViewGallery,
  bulletin
}: { 
  userName: string, 
  onNewCharacter: () => void, 
  onViewGallery: () => void,
  bulletin?: React.ReactNode
}) {
  return (
    <div className="relative h-full overflow-hidden bg-muted/10 backdrop-blur-md border border-primary/10 p-6 md:p-10 shadow-2xl shadow-primary/5 group">
      {/* Grid Background for Terminal */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] opacity-50 pointer-events-none" />
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 group-hover:border-primary/40 transition-colors" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 group-hover:border-primary/40 transition-colors" />
      
      <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center h-full">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge icon={<Shield className="h-3 w-3" />} label="Sevastopol Intelligence" color="blue" />
            <Badge icon={<Cpu className="h-3 w-3" />} label="Infinity Corp Uplink" color="indigo" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold tracking-wider uppercase animate-pulse">
              <Activity className="h-3 w-3" />
              Sincronizado
            </div>
          </div>
          
          <div className="space-y-1">
            <GlitchText 
              className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase leading-none text-primary"
              glitchChance={0.03}
            >
              Terminal de Comando
            </GlitchText>
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-primary/30" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/60">
                Acesso Autorizado: Agente {userName}
              </p>
            </div>
          </div>

          <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed font-medium">
            Bem-vindo ao nexo operacional. Gerencie dossiês de indivíduos ultra-humanos e monitore atividades em tempo real.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={onNewCharacter} className="h-12 px-6 gap-2 font-bold uppercase tracking-tight bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <PlusCircle className="h-5 w-5" />
              Registrar Indivíduo
            </Button>
            <Button size="lg" variant="outline" onClick={onViewGallery} className="h-12 px-6 gap-2 font-bold uppercase tracking-tight border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all">
              <FileText className="h-5 w-5" />
              Arquivos de Caso
            </Button>
          </div>
        </div>

        {bulletin && (
          <div className="lg:col-span-5 h-full flex flex-col justify-center">
            <div className="relative">
              {/* Subtle glow behind bulletin */}
              <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-3xl -z-10" />
              {bulletin}
            </div>
          </div>
        )}
      </div>
      
      {/* Background elements for Hero */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
        <Terminal className="h-80 w-80 text-primary" strokeWidth={0.5} />
      </div>

      {/* Terminal-like status bar at bottom */}
      <div className="absolute bottom-4 left-12 right-12 hidden md:flex items-center justify-between opacity-30 font-mono text-[8px] uppercase tracking-widest">
        <div className="flex gap-4">
          <span>Latência: 14ms</span>
          <span>Criptografia: AES-256</span>
        </div>
        <div className="flex gap-4">
          <span>ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          <span>V: 2.4.0</span>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label, color }: { icon: React.ReactNode, label: string, color: 'blue' | 'indigo' }) {
  const colorClasses = color === 'blue' 
    ? "bg-primary/10 border-primary/20 text-primary/80" 
    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
    
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${colorClasses}`}>
      {icon}
      {label}
    </div>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string, actionLabel: string, onAction: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <div className="absolute top-0 left-0 h-8 w-1 bg-primary blur-sm opacity-50" />
        </div>
        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-foreground/90">{title}</h2>
      </div>
      <Button variant="ghost" onClick={onAction} className="gap-1 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary hover:bg-primary/5 transition-all">
        {actionLabel} <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface RecentDossiersListProps {
  isLoading: boolean;
  characters: CharacterDocument[];
  onSelect: (char: CharacterDocument) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  onStartFirstRecord: () => void;
}

function RecentDossiersList({ 
  isLoading, 
  characters, 
  onSelect, 
  onDelete, 
  deletingId, 
  onStartFirstRecord 
}: RecentDossiersListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed bg-muted/5 border-primary/20 rounded-2xl">
        <div className="rounded-full bg-primary/5 p-6 mb-6 border border-primary/10 animate-pulse">
          <Users className="h-10 w-10 text-primary/60" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tighter italic mb-2">Sem registros no banco</h3>
        <p className="text-muted-foreground mb-8 text-sm max-w-xs font-medium">Nenhum indivíduo ultra-humano foi registrado sob sua jurisdição até o momento.</p>
        <Button onClick={onStartFirstRecord} className="font-bold uppercase tracking-tight h-12 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <PlusCircle className="mr-2 h-5 w-5" />
          Iniciar Primeiro Registro
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {characters.map((char) => (
        <CharacterCard
          key={char.id}
          character={char}
          onSelect={() => onSelect(char)}
          onDelete={() => onDelete(char.id)}
          isDeleting={deletingId === char.id}
        />
      ))}
    </div>
  );
}


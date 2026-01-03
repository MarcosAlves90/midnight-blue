"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  PlusCircle, 
  Store, 
  BookOpen, 
  Clock,
  ChevronRight,
  Sparkles,
  Activity,
  Shield,
  Cpu,
  FileText,
  Terminal
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

import { OperationsBulletin } from "@/components/pages/dashboard/operations-bulletin";
import { StatCard, QuickActionLink } from "@/components/pages/dashboard/dashboard-cards";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedCharacter, setSelectedCharacter } = useCharacter();
  
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

  const totalCharacters = characters.length;
  const lastUpdateDate = characters.length > 0 
    ? new Date(Math.max(...characters.map(c => c.updatedAt.getTime()))).toLocaleDateString('pt-BR')
    : "Nenhuma";

  const userName = user?.displayName?.split(' ')[0] || 'OPERACIONAL';

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-700">
      <HeroSection 
        userName={userName} 
        onNewCharacter={() => setDialogOpen(true)} 
        onViewGallery={() => router.push('/dashboard/galeria')}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Registros Ativos" 
          value={isLoading ? null : totalCharacters} 
          description="Indivíduos monitorados" 
          icon={<Users className="h-4 w-4 text-blue-400" />} 
        />
        <StatCard 
          title="Último Relatório" 
          value={isLoading ? null : lastUpdateDate} 
          description="Sincronização Sevastopol" 
          icon={<Clock className="h-4 w-4 text-blue-400" />} 
        />
        <StatCard 
          title="Foco Operacional" 
          value={isLoading ? null : (selectedCharacter?.identity?.heroName || "NENHUM")} 
          description="Perfil em destaque" 
          icon={<Sparkles className="h-4 w-4 text-blue-400" />} 
        />
        <StatCard 
          title="Rede Sevastopol" 
          value="ESTÁVEL" 
          description="Criptografia Infinity Corp" 
          icon={<Activity className="h-4 w-4 text-green-500" />} 
          valueClassName="text-green-500"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-7">
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

        <aside className="md:col-span-3 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase italic">Protocolos</h2>
            <div className="grid gap-3">
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

          <OperationsBulletin />
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

function HeroSection({ userName, onNewCharacter, onViewGallery }: { userName: string, onNewCharacter: () => void, onViewGallery: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/40 via-card to-card border border-blue-500/20 p-8 md:p-12 shadow-2xl shadow-blue-500/5">
      <div className="relative z-10 max-w-2xl">
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge icon={<Shield className="h-3 w-3" />} label="Sevastopol Intelligence" color="blue" />
          <Badge icon={<Cpu className="h-3 w-3" />} label="Powered by Infinity Corp" color="indigo" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic uppercase leading-none">
          Terminal de <span className="text-blue-400">Comando</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
          Bem-vindo, Agente <span className="text-foreground font-semibold">{userName}</span>. 
          Acesso autorizado ao banco de dados de indivíduos ultra-humanos.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button size="lg" onClick={onNewCharacter} className="gap-2 font-bold uppercase tracking-tight bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="h-5 w-5" />
            Registrar Indivíduo
          </Button>
          <Button size="lg" variant="outline" onClick={onViewGallery} className="gap-2 font-bold uppercase tracking-tight border-blue-500/30 hover:bg-blue-500/10">
            <FileText className="h-5 w-5" />
            Arquivos de Caso
          </Button>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block opacity-10">
        <Terminal className="h-64 w-64 text-blue-500" strokeWidth={0.5} />
      </div>
    </div>
  );
}

function Badge({ icon, label, color }: { icon: React.ReactNode, label: string, color: 'blue' | 'indigo' }) {
  const colorClasses = color === 'blue' 
    ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 bg-blue-600 rounded-full" />
        <h2 className="text-2xl font-black tracking-tighter uppercase italic">{title}</h2>
      </div>
      <Button variant="ghost" onClick={onAction} className="gap-1 text-xs font-bold uppercase tracking-wider hover:text-blue-400">
        {actionLabel} <ChevronRight className="h-4 w-4" />
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
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed bg-muted/5 border-blue-500/20">
        <div className="rounded-full bg-blue-500/10 p-4 mb-4">
          <Users className="h-8 w-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold uppercase tracking-tight">Sem registros no banco</h3>
        <p className="text-muted-foreground mb-6 text-sm">Nenhum indivíduo ultra-humano foi registrado sob sua jurisdição.</p>
        <Button onClick={onStartFirstRecord} className="font-bold uppercase bg-blue-600 hover:bg-blue-700">Iniciar Registro</Button>
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


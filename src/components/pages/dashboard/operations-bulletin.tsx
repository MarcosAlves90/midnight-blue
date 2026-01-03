"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NewsItem, generateNewsItem } from "@/lib/news-service";

const INITIAL_NEWS_1: NewsItem = {
  title: "SISTEMA INICIALIZADO",
  content: "Terminal de monitoramento Sevastopol ativo. Aguardando feed de dados globais...",
  type: "info",
  timestamp: "AGORA",
  status: "ESTÁVEL",
  source: "SYS_CORE"
};

const INITIAL_NEWS_2: NewsItem = {
  title: "CONEXÃO ESTABELECIDA",
  content: "Link com a rede Infinity Corp estável. Criptografia de nível militar ativa.",
  type: "info",
  timestamp: "AGORA",
  status: "ATIVO",
  source: "INF_LINK"
};

export function OperationsBulletin({ embedded = false }: { embedded?: boolean }) {
  const [news1, setNews1] = useState<NewsItem>(INITIAL_NEWS_1);
  const [news2, setNews2] = useState<NewsItem>(INITIAL_NEWS_2);
  const [fade1, setFade1] = useState(true);
  const [fade2, setFade2] = useState(true);
  const [terminalId, setTerminalId] = useState("SEV-000-INF");
  
  const news1Ref = useRef<NewsItem>(INITIAL_NEWS_1);
  const news2Ref = useRef<NewsItem>(INITIAL_NEWS_2);

  useEffect(() => {
    setTerminalId(`SEV-${Math.floor(100 + Math.random() * 900)}-INF`);

    const interval1 = setInterval(() => {
      setFade1(false);
      setTimeout(() => {
        let next = generateNewsItem();
        while (next.content === news2Ref.current?.content) {
          next = generateNewsItem();
        }
        news1Ref.current = next;
        setNews1(next);
        setFade1(true);
      }, 500);
    }, 5000);

    const interval2 = setInterval(() => {
      setFade2(false);
      setTimeout(() => {
        let next = generateNewsItem();
        while (next.content === news1Ref.current?.content) {
          next = generateNewsItem();
        }
        news2Ref.current = next;
        setNews2(next);
        setFade2(true);
      }, 500);
    }, 8500);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  const renderNews = (item: NewsItem, isVisible: boolean) => {
    return (
      <div className={cn(
        "space-y-1 border-l-2 pl-3 transition-all duration-500 relative group",
        item.type === 'alert' ? "border-red-500/50" : item.type === 'warning' ? "border-amber-500/50" : "border-blue-500/50",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
      )}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-tight",
              item.type === 'alert' ? "text-red-400" : item.type === 'warning' ? "text-amber-400" : "text-blue-300"
            )}>
              {item.title}
            </p>
            {item.status && (
              <span className="text-[7px] px-1 rounded bg-muted text-muted-foreground font-mono">
                {item.status}
              </span>
            )}
          </div>
          <span className="text-[8px] font-mono text-muted-foreground/50">{item.timestamp}</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed pr-2">
          {item.content}
        </p>
        {item.source && (
          <div className="text-[7px] font-mono text-blue-500/30 uppercase tracking-tighter">
            SRC: {item.source}
          </div>
        )}
      </div>
    );
  };

  const content = (
    <div className={cn("flex-1 flex flex-col gap-5", !embedded && "pt-4")}>
      {renderNews(news1, fade1)}
      {renderNews(news2, fade2)}
    </div>
  );

  if (embedded) {
    return (
      <div className="space-y-4 relative overflow-hidden group/bulletin">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/90 italic">Boletim de Operações</span>
          </div>
          <span className="text-[8px] font-mono text-muted-foreground/40">{terminalId}</span>
        </div>
        {content}
        <div className="pt-3 mt-4 border-t border-primary/10">
          <div className="flex items-center justify-between text-[8px] font-mono text-primary/40 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              LIVE_FEED_ACTIVE
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full bg-muted/10 backdrop-blur-sm border-primary/10 overflow-hidden relative shadow-2xl shadow-primary/5 py-0 gap-0 group flex flex-col">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition-colors" />
      <CardHeader className="pb-2 pt-4 px-4 border-b border-primary/5">
        <CardTitle className="flex items-center gap-2 text-primary/80 font-black tracking-tighter uppercase italic text-sm">
          <AlertTriangle className="h-4 w-4 text-primary" />
          Boletim de Operações
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[150px] flex flex-col px-4 pb-4">
        {content}
        
        <div className="pt-3 mt-4 border-t border-primary/10">
          <div className="flex items-center justify-between text-[8px] font-mono text-primary/40 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              LIVE_FEED_ACTIVE
            </span>
            <span>TERMINAL: {terminalId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

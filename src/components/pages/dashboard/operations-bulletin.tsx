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

export function OperationsBulletin() {
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

  return (
    <Card className="bg-blue-950/20 border-blue-500/30 overflow-hidden relative shadow-lg shadow-blue-900/10 py-0 gap-0">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="flex items-center gap-2 text-blue-400 font-black tracking-tighter uppercase italic text-sm">
          <AlertTriangle className="h-4 w-4" />
          Boletim de Operações
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-[150px] flex flex-col px-4 pb-4">
        <div className="flex-1 flex flex-col gap-4 pt-2">
          {renderNews(news1, fade1)}
          {renderNews(news2, fade2)}
        </div>
        
        <div className="pt-2 mt-2 border-t border-blue-500/10">
          <div className="flex items-center justify-between text-[9px] font-mono text-blue-500/50 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
              LIVE_FEED
            </span>
            <span>ID: {terminalId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

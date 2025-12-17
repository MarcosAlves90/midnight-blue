"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

export interface BreadcrumbConfig {
  excludeSegments?: string[];
  customLabels?: Record<string, string>;
  showHome?: boolean;
  dynamicRouteHandler?: (
    segment: string,
    index: number,
    segments: string[],
  ) => string | null;
}

// Mapeamento padrão de rotas para títulos legíveis
const defaultRouteLabels: Record<string, string> = {
  dashboard: "Dashboard",
  personagem: "Personagem",
  individual: "Individual",
  caracteristicas: "Características",
  status: "Status",
  skills: "Skills",
  inventario: "Inventário",
  anotacoes: "Anotações",
  loja: "Loja",
  "deep-web": "Deep Web",
  "taverna-animada": "Taverna Animada",
  "barco-musiquinho": "Barco do Musiquinho",
  documentacao: "Documentação",
  introduction: "Introdução",
  "get-started": "Começar",
  tutorials: "Tutoriais",
  changelog: "Changelog",
  wiki: "Wiki",
  general: "Geral",
  team: "Equipe",
  billing: "Cobrança",
  limits: "Limites",
};

// Função para detectar se um segmento é um ID dinâmico
function isDynamicSegment(segment: string): boolean {
  // Detecta UUIDs, números, ou segmentos que parecem IDs
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const numericRegex = /^\d+$/;
  const hashRegex = /^[a-f0-9]{6,}$/i;

  return (
    uuidRegex.test(segment) ||
    numericRegex.test(segment) ||
    hashRegex.test(segment)
  );
}

// Função para obter o título legível de um segmento de rota
function getRouteLabel(
  segment: string,
  index: number,
  segments: string[],
  config?: BreadcrumbConfig,
): string {
  const routeLabels = { ...defaultRouteLabels, ...config?.customLabels };

  // Se há um handler customizado para rotas dinâmicas, usa ele primeiro
  if (config?.dynamicRouteHandler) {
    const customLabel = config.dynamicRouteHandler(segment, index, segments);
    if (customLabel) return customLabel;
  }

  // Se o segmento parece ser um ID dinâmico, trata de forma especial
  if (isDynamicSegment(segment)) {
    const previousSegment = segments[index - 1];
    if (previousSegment) {
      const baseLabel =
        routeLabels[previousSegment] ||
        previousSegment.charAt(0).toUpperCase() + previousSegment.slice(1);
      return `${baseLabel} #${segment.slice(0, 8)}`;
    }
    return `ID: ${segment.slice(0, 8)}`;
  }

  return (
    routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export function useBreadcrumb(config?: BreadcrumbConfig): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    // Remove barras duplas e divide o pathname em segmentos
    const segments = pathname.split("/").filter(Boolean);

    // Filtra segmentos excluídos se especificado na config
    const filteredSegments = config?.excludeSegments
      ? segments.filter((segment) => !config.excludeSegments!.includes(segment))
      : segments;

    // Se estivermos na raiz do dashboard, retorna apenas o Dashboard
    if (filteredSegments.length <= 1) {
      const homeItem = {
        label: config?.showHome ? "Home" : "Dashboard",
        href: "/dashboard",
        isCurrentPage: true,
      };
      return [homeItem];
    }

    // Constrói o breadcrumb baseado nos segmentos da URL
    const breadcrumbItems: BreadcrumbItem[] = [];
    let currentPath = "";

    // Adiciona item Home se configurado
    if (config?.showHome && filteredSegments.length > 0) {
      breadcrumbItems.push({
        label: "Home",
        href: "/",
        isCurrentPage: false,
      });
    }

    filteredSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isCurrentPage = index === filteredSegments.length - 1;

      breadcrumbItems.push({
        label: getRouteLabel(segment, index, filteredSegments, config),
        href: currentPath,
        isCurrentPage,
      });
    });

    return breadcrumbItems;
  }, [pathname, config]);
}

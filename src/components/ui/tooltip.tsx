"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

/**
 * Contexto para compartilhar o estado de abertura do Tooltip entre o Root e o Trigger.
 * Isso é necessário para suportar o comportamento de "long press" em dispositivos touch.
 */
const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      disableHoverableContent={true}
      {...props}
    />
  );
}

function Tooltip({
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipProvider>
      <TooltipContext.Provider value={{ open, setOpen }}>
        <TooltipPrimitive.Root
          data-slot="tooltip"
          {...props}
          open={props.open ?? open}
          onOpenChange={(val) => {
            setOpen(val);
            props.onOpenChange?.(val);
          }}
        >
          {children}
        </TooltipPrimitive.Root>
      </TooltipContext.Provider>
    </TooltipProvider>
  );
}

function TooltipTrigger({
  className,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onContextMenu,
  onClick,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const context = React.useContext(TooltipContext);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = React.useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Apenas para dispositivos touch
    if (e.pointerType !== "touch") return;

    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      context?.setOpen(true);

      // Feedback tátil (vibração) se disponível
      if (typeof window !== "undefined" && window.navigator.vibrate) {
        window.navigator.vibrate(40);
      }
    }, 500); // 500ms para considerar um "long press"
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isLongPressRef.current) {
      // Se foi um long press, fechamos após um tempo para permitir a leitura
      setTimeout(() => {
        context?.setOpen(false);
        isLongPressRef.current = false;
      }, 1500);
    }
  };

  const handlePointerCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isLongPressRef.current) {
      context?.setOpen(false);
      isLongPressRef.current = false;
    }
  };

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onPointerDown={(e) => {
        handlePointerDown(e);
        onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        handlePointerUp();
        onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        handlePointerCancel();
        onPointerCancel?.(e);
      }}
      onContextMenu={(e) => {
        // Previne o menu de contexto se estivermos em um long press
        if (isLongPressRef.current) e.preventDefault();
        onContextMenu?.(e);
      }}
      onClick={(e) => {
        // Se foi um long press, cancelamos o clique para não disparar ações acidentais
        if (isLongPressRef.current) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          onClick?.(e);
        }
      }}
      className={cn("select-none", className)}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-border/50 bg-background/80 backdrop-blur-md px-3 py-1.5 text-xs text-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 pointer-events-none",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

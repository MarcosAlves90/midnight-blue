"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getClientAuth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const auth = getClientAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsub();
  }, [router]);

  return <>{children}</>;
}

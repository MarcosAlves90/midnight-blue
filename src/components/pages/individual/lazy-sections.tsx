"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy sections with loading fallback
const BiometricDataLazy = dynamic(
  () => import("@/components/pages/individual/biometric-data").then((m) => ({ default: m.BiometricData })),
  { loading: () => <Skeleton className="h-40 w-full" /> }
);

const PersonalDataLazy = dynamic(
  () => import("@/components/pages/individual/personal-data").then((m) => ({ default: m.PersonalData })),
  { loading: () => <Skeleton className="h-40 w-full" /> }
);

const ConfidentialFileLazy = dynamic(
  () => import("@/components/pages/individual/confidential-file").then((m) => ({ default: m.ConfidentialFileSection })),
  { loading: () => <Skeleton className="h-40 w-full" /> }
);

const HistoryLazy = dynamic(
  () => import("@/components/pages/individual/history-data").then((m) => ({ default: m.HistorySection })),
  { loading: () => <Skeleton className="h-40 w-full" /> }
);

const ComplicationsLazy = dynamic(
  () => import("@/components/pages/individual/complications").then((m) => ({ default: m.ComplicationsSection })),
  { loading: () => <Skeleton className="h-40 w-full" /> }
);

export {
  BiometricDataLazy,
  PersonalDataLazy,
  ConfidentialFileLazy,
  HistoryLazy,
  ComplicationsLazy,
};

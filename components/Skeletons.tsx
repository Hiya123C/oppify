import { Skeleton } from "@/components/ui/skeleton";

// Your cards sit on a glassy background, so use a slightly darker tint
// than the default so the skeleton stays visible
const tint = "bg-gray-300/60";

export function SkeletonCard({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div className={`${fullWidth ? "w-full" : "w-72 shrink-0"} cards rounded-2xl p-5`}>
      <div className="flex justify-between items-start mb-3">
        <Skeleton className={`h-6 w-20 rounded-full ${tint}`} />
        <Skeleton className={`h-6 w-6 rounded-full ${tint}`} />
      </div>
      <Skeleton className={`h-5 w-3/4 ${tint}`} />
      <div className="mt-3 space-y-2">
        <Skeleton className={`h-3 w-full ${tint}`} />
        <Skeleton className={`h-3 w-full ${tint}`} />
        <Skeleton className={`h-3 w-2/3 ${tint}`} />
      </div>
    </div>
  );
}

export function SkeletonSignupRow() {
  return (
    <div className="cards rounded-xl px-5 py-4 flex justify-between items-center">
      <Skeleton className={`h-4 w-48 ${tint}`} />
      <Skeleton className={`h-5 w-16 rounded-full ${tint}`} />
    </div>
  );
}

export function SkeletonPageHeader() {
  return (
    <div className="space-y-3">
      <Skeleton className={`h-12 w-72 max-w-full ${tint}`} />
      <Skeleton className={`h-5 w-56 max-w-full ${tint}`} />
    </div>
  );
}

export function SkeletonSectionTitle() {
  return <Skeleton className={`h-8 w-56 max-w-full ${tint}`} />;
}
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-pulse rounded-xl bg-gradient-to-r from-muted via-card to-muted shadow-[inset_0_0_0_1px_oklch(0.929_0.013_255.508_/_0.45)]",
        className,
      )}
    />
  );
}

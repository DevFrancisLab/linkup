import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-10 text-sm",
  md: "size-12 text-base",
  lg: "size-14 text-lg",
} as const;

interface AvatarPlaceholderProps {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
  ring?: boolean;
}

/** Simple circular avatar placeholder built from initials — no photos. */
export function AvatarPlaceholder({
  name,
  size = "md",
  className,
  ring = false,
}: AvatarPlaceholderProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight",
        "gradient-brand text-primary-foreground",
        ring && "ring-2 ring-card ring-offset-2 ring-offset-background",
        sizes[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}

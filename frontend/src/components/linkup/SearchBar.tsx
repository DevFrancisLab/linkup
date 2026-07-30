import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function SearchBar({
  className,
  label = "Search",
  ...props
}: SearchBarProps) {
  return (
    <label
      className={cn(
        "flex h-12 items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-[var(--shadow-soft)] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring/20",
        className,
      )}
    >
      <Search
        className="size-5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        {...props}
      />
    </label>
  );
}

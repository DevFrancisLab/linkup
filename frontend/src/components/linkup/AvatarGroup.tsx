import { AvatarPlaceholder } from "./Avatar";

interface AvatarGroupProps {
  names: string[];
  max?: number;
  label?: string;
}

export function AvatarGroup({
  names,
  max = 3,
  label = "Attendees",
}: AvatarGroupProps) {
  const visibleNames = names.slice(0, max);
  const remaining = names.length - visibleNames.length;

  return (
    <div
      aria-label={`${label}: ${names.join(", ")}`}
      className="flex items-center"
    >
      {visibleNames.map((name, index) => (
        <AvatarPlaceholder
          key={name}
          name={name}
          size="sm"
          className={
            index === 0 ? "ring-2 ring-card" : "-ml-3 ring-2 ring-card"
          }
        />
      ))}
      {remaining > 0 && (
        <span className="-ml-3 flex size-10 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-2 ring-card">
          +{remaining}
        </span>
      )}
    </div>
  );
}

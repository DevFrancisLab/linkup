import { Bot } from "lucide-react";

interface AIAvatarProps {
  avatarUrl?: string;
}

export function AIAvatar({ avatarUrl }: AIAvatarProps) {
  return (
    <div className="relative flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] border border-primary/15 bg-card/75 shadow-[0_24px_60px_-24px_oklch(0.21_0.035_258_/_0.32)] backdrop-blur-sm">
      {avatarUrl ? (
        <iframe
          src={avatarUrl}
          title="LinkUp AI Avatar"
          allow="autoplay; camera; microphone; fullscreen"
          className="size-full border-0"
        />
      ) : (
        <AvatarFallback />
      )}
    </div>
  );
}

function AvatarFallback() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,oklch(0.72_0.16_262.9_/_0.35),transparent_44%),radial-gradient(circle_at_50%_80%,oklch(0.62_0.2_310_/_0.24),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-8 rounded-[2rem] border border-primary/15" />
      <div className="relative flex size-44 items-center justify-center rounded-full gradient-brand shadow-[0_0_0_16px_oklch(0.546_0.215_262.9_/_0.1),0_20px_44px_oklch(0.546_0.215_262.9_/_0.3)]">
        <Bot className="size-20 text-primary-foreground" strokeWidth={1.5} />
      </div>
      <span className="absolute left-[18%] top-[23%] size-3 animate-pulse rounded-full bg-primary shadow-[0_0_20px_oklch(0.546_0.215_262.9_/_0.9)]" />
      <span className="absolute bottom-[23%] right-[18%] size-2.5 animate-pulse rounded-full bg-secondary shadow-[0_0_20px_oklch(0.62_0.2_310_/_0.8)] [animation-delay:700ms]" />
    </>
  );
}

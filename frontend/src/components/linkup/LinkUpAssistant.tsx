import { useMutation } from "@tanstack/react-query";
import { ArrowUp, Search, Sparkles } from "lucide-react";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrors } from "@/services/auth";
import { aiService } from "@/services/ai";

const AI_SESSION_KEY = "linkup.ai-session-id";
const SUGGESTIONS = [
  "Find AI founders",
  "Who's having coffee?",
  "Find people travelling to Westlands",
  "Continue networking",
  "Find tomorrow's events",
  "Create an event",
  "Show nearby attendees",
];

type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
};

const getStoredSessionId = () => {
  if (typeof window === "undefined") return undefined;
  return window.sessionStorage.getItem(AI_SESSION_KEY) ?? undefined;
};

export function LinkUpAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sessionId, setSessionId] = useState(getStoredSessionId);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [error, setError] = useState("");
  const chatMutation = useMutation({ mutationFn: aiService.chat });

  const latestSuggestions = useMemo(() => {
    const latestAssistantMessage = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");
    return latestAssistantMessage?.suggestions;
  }, [messages]);

  const runQuery = useCallback(
    (nextQuery: string) => {
      const message = nextQuery.trim();
      if (!message || chatMutation.isPending) return;

      setQuery("");
      setError("");
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "user", content: message },
      ]);
      chatMutation.mutate(
        { message, session_id: sessionId },
        {
          onSuccess: (response) => {
            setSessionId(response.session_id);
            if (typeof window !== "undefined") {
              window.sessionStorage.setItem(
                AI_SESSION_KEY,
                response.session_id,
              );
            }
            setMessages((current) => [
              ...current,
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response.reply,
                suggestions: response.suggestions,
              },
            ]);
          },
          onError: (requestError) => {
            const errors = getApiErrors(requestError);
            setError(
              errors.detail ??
                errors.non_field_errors ??
                "LinkUp AI is temporarily unavailable.",
            );
          },
        },
      );
    },
    [chatMutation, sessionId],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runQuery(query);
  };

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      const intention = (event as CustomEvent<{ intention?: string }>).detail
        ?.intention;
      if (!intention) return;
      setOpen(true);
      runQuery(intention);
    };

    window.addEventListener("linkup:assistant-prompt", handlePrompt);
    return () =>
      window.removeEventListener("linkup:assistant-prompt", handlePrompt);
  }, [runQuery]);

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="gradient-brand fixed bottom-[calc(env(safe-area-inset-bottom)+6rem)] right-5 z-40 inline-flex min-h-14 items-center gap-2.5 overflow-hidden rounded-full px-5 font-display text-sm font-semibold text-primary-foreground shadow-[0_8px_16px_oklch(0.21_0.035_258_/_0.16),0_20px_40px_-14px_oklch(0.546_0.215_262.9_/_0.62)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-1 hover:shadow-[0_10px_20px_oklch(0.21_0.035_258_/_0.2),0_24px_44px_-14px_oklch(0.546_0.215_262.9_/_0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]"
      >
        <span className="absolute inset-0 bg-card/20 opacity-0 transition-opacity duration-200 active:opacity-100" />
        <Sparkles className="relative size-5" aria-hidden="true" />
        <span className="relative">Ask LinkUp</span>
      </button>

      <DrawerContent className="z-50 mx-auto h-[75dvh] max-w-md rounded-t-[2rem] border-border/70 bg-background shadow-[0_-16px_48px_oklch(0.21_0.035_258_/_0.18)]">
        <DrawerHeader className="px-5 pb-3 pt-4 text-left">
          <DrawerTitle className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground">
            <span className="flex size-9 items-center justify-center rounded-xl gradient-brand text-primary-foreground shadow-sm">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            LinkUp AI
          </DrawerTitle>
          <DrawerDescription className="ml-11 text-sm font-medium">
            Your AI networking concierge
            {user?.first_name ? `, ${user.first_name}` : ""}.
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-28">
          {messages.length ? (
            <div className="space-y-4 py-2" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-10 rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground"
                      : "mr-6 rounded-3xl rounded-bl-md border border-primary/10 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground"
                  }
                >
                  {message.content}
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="mr-20 flex items-center gap-2 rounded-3xl rounded-bl-md border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                  <Sparkles className="size-4 animate-pulse text-primary" />
                  LinkUp AI is thinking…
                </div>
              )}
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {latestSuggestions &&
                latestSuggestions.length > 0 &&
                !chatMutation.isPending && (
                  <SuggestionButtons
                    suggestions={latestSuggestions}
                    onSelect={runQuery}
                  />
                )}
            </div>
          ) : (
            <div className="pt-2">
              <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-card to-secondary/[0.08] p-5">
                <p className="font-display text-base font-semibold text-foreground">
                  What can I help you discover?
                </p>
                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  Ask for people, events, communities, or a shortcut around
                  LinkUp.
                </p>
              </div>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Try asking
              </p>
              <SuggestionButtons
                suggestions={SUGGESTIONS}
                onSelect={runQuery}
              />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="absolute inset-x-0 bottom-0 border-t border-border/70 bg-card/95 px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-1.5 shadow-[var(--shadow-soft)] focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring/20">
            <Search
              className="ml-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask anything..."
              disabled={chatMutation.isPending}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={chatMutation.isPending || !query.trim()}
              aria-label="Send question"
              className="gradient-brand flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

function SuggestionButtons({
  suggestions,
  onSelect,
}: {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="min-h-11 rounded-full border border-border bg-card px-3 text-left text-xs font-semibold text-primary shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 hover:shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

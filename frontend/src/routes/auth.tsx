import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrors } from "@/services/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — LinkUp" }] }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

interface FormValues {
  fullName: string;
  username: string;
  identifier: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  remember: boolean;
}

type FormErrors = Partial<
  Record<keyof FormValues | "non_field_errors", string>
>;

const INITIAL_VALUES: FormValues = {
  fullName: "",
  username: "",
  identifier: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  remember: false,
};

function validate(values: FormValues, mode: Mode): FormErrors {
  const errors: FormErrors = {};
  if (mode === "signin" && !values.identifier.trim()) {
    errors.identifier = "Enter your username or email.";
  }
  if (mode === "signup") {
    if (values.fullName.trim().split(/\s+/).length < 2)
      errors.fullName = "Enter your first and last name.";
    if (!/^[\w.@+-]{1,150}$/.test(values.username))
      errors.username = "Choose a valid username.";
    if (!/^\+?[0-9\s()-]{7,}$/.test(values.phone.trim()))
      errors.phone = "Enter a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(values.email))
      errors.email = "Enter a valid email address.";
    if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
  }
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: typeof Phone;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </span>
      <span
        className={cn(
          "flex min-h-14 items-center gap-3 rounded-2xl border bg-card px-4 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-300 ease-out focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-ring/20",
          error ? "border-destructive/60" : "border-border/80",
        )}
      >
        <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
        {children}
      </span>
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = <Key extends keyof FormValues>(
    key: Key,
    value: FormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({
      ...current,
      [key]: undefined,
      non_field_errors: undefined,
    }));
  };

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setErrors({});
    setNotice("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setNotice("");
    try {
      if (mode === "signup") {
        const [firstName, ...lastName] = values.fullName.trim().split(/\s+/);
        await register(
          {
            username: values.username.trim(),
            first_name: firstName,
            last_name: lastName.join(" "),
            email: values.email.trim(),
            phone: values.phone.trim(),
            password: values.password,
          },
          values.remember,
        );
        await navigate({ to: "/complete-profile" });
      } else {
        await login({
          identifier: values.identifier.trim(),
          password: values.password,
          remember: values.remember,
        });
        await navigate({ to: "/home" });
      }
    } catch (error) {
      const apiErrors = getApiErrors(error);
      setErrors({
        username: apiErrors.username,
        email: apiErrors.email,
        password: apiErrors.password,
        non_field_errors: apiErrors.non_field_errors ?? apiErrors.detail,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-88 bg-[radial-gradient(circle_at_50%_0%,oklch(0.546_0.215_262.9_/_0.2),transparent_66%)]" />
      <div className="pointer-events-none absolute -right-24 top-44 size-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex size-12 items-center justify-center rounded-2xl gradient-brand text-primary-foreground shadow-[var(--shadow-raised)]">
          <Sparkles className="size-5" aria-hidden="true" />
        </div>
        <header className="mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            LinkUp
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            {mode === "signin" ? "Welcome back" : "Find your people"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {mode === "signin"
              ? "Continue building meaningful connections."
              : "Create your profile and make every event count."}
          </p>
        </header>
        <div
          className="mt-8 grid grid-cols-2 rounded-2xl bg-muted p-1"
          role="tablist"
          aria-label="Authentication options"
        >
          {(["signin", "signup"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={mode === tab}
              onClick={() => changeMode(tab)}
              className={cn(
                "min-h-11 rounded-xl px-3 text-sm font-semibold transition-[background-color,color,box-shadow,transform] duration-300 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
                mode === tab
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          {mode === "signup" && (
            <>
              <Field label="Full Name" icon={UserRound} error={errors.fullName}>
                <input
                  value={values.fullName}
                  onChange={(event) =>
                    updateValue("fullName", event.target.value)
                  }
                  autoComplete="name"
                  placeholder="Your full name"
                  className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
              </Field>
              <Field label="Username" icon={UserRound} error={errors.username}>
                <input
                  value={values.username}
                  onChange={(event) =>
                    updateValue("username", event.target.value)
                  }
                  autoComplete="username"
                  placeholder="Choose a username"
                  className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
              </Field>
              <Field label="Phone Number" icon={Phone} error={errors.phone}>
                <input
                  value={values.phone}
                  onChange={(event) => updateValue("phone", event.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+254 700 000 000"
                  className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
              </Field>
              <Field label="Email" icon={Mail} error={errors.email}>
                <input
                  value={values.email}
                  onChange={(event) => updateValue("email", event.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                />
              </Field>
            </>
          )}
          {mode === "signin" && (
            <Field
              label="Username or Email"
              icon={UserRound}
              error={errors.identifier}
            >
              <input
                value={values.identifier}
                onChange={(event) =>
                  updateValue("identifier", event.target.value)
                }
                autoComplete="username"
                placeholder="Your username or email"
                className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </Field>
          )}
          <Field label="Password" icon={LockKeyhole} error={errors.password}>
            <input
              value={values.password}
              onChange={(event) => updateValue("password", event.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              placeholder="At least 8 characters"
              className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </Field>
          {mode === "signup" && (
            <Field
              label="Confirm Password"
              icon={LockKeyhole}
              error={errors.confirmPassword}
            >
              <input
                value={values.confirmPassword}
                onChange={(event) =>
                  updateValue("confirmPassword", event.target.value)
                }
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </Field>
          )}
          <div className="flex min-h-11 items-center justify-between gap-3">
            <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-foreground">
              <input
                checked={values.remember}
                onChange={(event) =>
                  updateValue("remember", event.target.checked)
                }
                type="checkbox"
                className="size-5 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              Remember Me
            </label>
            {mode === "signin" && (
              <button
                type="button"
                onClick={() =>
                  setNotice("Password reset is not configured yet.")
                }
                className="min-h-11 text-sm font-semibold text-primary transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Forgot Password?
              </button>
            )}
          </div>
          {(notice || errors.non_field_errors) && (
            <p
              role="status"
              className="rounded-xl bg-primary/8 px-3 py-2 text-xs font-medium leading-5 text-primary"
            >
              {errors.non_field_errors ?? notice}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="gradient-brand inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 font-display text-sm font-semibold text-primary-foreground shadow-[var(--shadow-raised)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_22px_oklch(0.546_0.215_262.9_/_0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "Connecting..." : "Continue"}
            <Sparkles className="size-4" aria-hidden="true" />
          </button>
        </form>
        <div className="my-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or continue with
          <span className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          onClick={() => setNotice("Google sign-in will be available soon.")}
          className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-border/80 bg-card px-5 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-amber-400 to-blue-500 text-[10px] font-bold text-white">
            G
          </span>
          Continue with Google
        </button>
      </div>
    </main>
  );
}

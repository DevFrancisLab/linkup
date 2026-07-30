import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  Camera,
  Check,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { getApiErrors } from "@/services/auth";

export const Route = createFileRoute("/complete-profile")({
  head: () => ({ meta: [{ title: "Complete your profile — LinkUp" }] }),
  component: CompleteProfilePage,
});

const INTERESTS = [
  "AI & Startups",
  "Product",
  "Design",
  "Technology",
  "Business",
  "Climate",
  "Music",
  "Community",
];

const LOOKING_FOR = [
  "Networking",
  "Friends",
  "Collaborators",
  "Mentors",
  "Investors",
  "Job Opportunities",
];

function SelectableChips({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
}) {
  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-foreground">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(option)}
              className={cn(
                "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-[transform,background-color,color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.97]",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_5px_12px_oklch(0.546_0.215_262.9_/_0.2)]"
                  : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5 hover:text-primary hover:shadow-[var(--shadow-soft)]",
              )}
            >
              {isSelected && (
                <Check className="mr-1.5 size-4" aria-hidden="true" />
              )}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(
    user?.avatar ?? undefined,
  );
  const [avatar, setAvatar] = useState<File>();
  const [profession, setProfession] = useState(user?.profession ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setPhotoUrl(user.avatar ?? undefined);
    setProfession(user.profession);
    setCompany(user.company);
    setBio(user.bio);
  }, [user]);

  const uploadPhoto = (file?: File) => {
    if (!file) return;
    setAvatar(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const finishSetup = async () => {
    if (!profession.trim() || !company.trim()) {
      setError("Add your profession and company to finish your profile.");
      return;
    }
    setIsSaving(true);
    try {
      const profile = new FormData();
      profile.set("profession", profession.trim());
      profile.set("company", company.trim());
      profile.set("bio", bio.trim());
      interests.forEach((interest) => profile.append("interests", interest));
      lookingFor.forEach((preference) =>
        profile.append("looking_for", preference),
      );
      if (avatar) profile.set("avatar", avatar);
      await updateProfile(profile);
      await navigate({ to: "/home" });
    } catch (requestError) {
      const errors = getApiErrors(requestError);
      setError(
        errors.detail ??
          errors.non_field_errors ??
          "Unable to save your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_50%_0%,oklch(0.546_0.215_262.9_/_0.18),transparent_66%)]" />
      <div className="relative mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex min-h-8 items-center rounded-full bg-primary/10 px-3 text-xs font-bold text-primary">
            Step 2 of 2
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            Almost there
          </span>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label="Profile setup progress"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={2}
        >
          <div className="h-full w-full rounded-full gradient-brand" />
        </div>
        <header className="mt-8">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Your LinkUp profile
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
            Make your introduction count.
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A few details help us introduce you to the right people.
          </p>
        </header>

        <section
          className="mt-8 flex flex-col items-center"
          aria-label="Profile photo"
        >
          <label className="group relative flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-card bg-gradient-to-br from-primary/15 to-secondary/15 text-primary shadow-[var(--shadow-raised)] ring-1 ring-primary/15 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile preview"
                className="size-full object-cover"
              />
            ) : (
              <UserRound className="size-10" aria-hidden="true" />
            )}
            <span className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full gradient-brand text-primary-foreground shadow-[0_4px_10px_oklch(0.546_0.215_262.9_/_0.32)] transition-transform duration-300 group-hover:scale-105">
              <Camera className="size-4" aria-hidden="true" />
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => uploadPhoto(event.target.files?.[0])}
              className="sr-only"
            />
          </label>
          <p className="mt-3 text-sm font-semibold text-foreground">
            Add profile photo
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            A friendly photo helps people recognize you.
          </p>
        </section>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">
              Profession
            </span>
            <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-300 focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-ring/20">
              <BriefcaseBusiness
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <input
                value={profession}
                onChange={(event) => {
                  setProfession(event.target.value);
                  setError("");
                }}
                placeholder="e.g. Product Designer"
                className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">
              Company
            </span>
            <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-border/80 bg-card px-4 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-300 focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-ring/20">
              <BriefcaseBusiness
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <input
                value={company}
                onChange={(event) => {
                  setCompany(event.target.value);
                  setError("");
                }}
                placeholder="Where do you work?"
                className="h-12 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">
              Short Bio{" "}
              <span className="font-medium text-muted-foreground">
                (optional)
              </span>
            </span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={180}
              rows={3}
              placeholder="What are you building, learning, or excited to discuss?"
              className="w-full resize-none rounded-2xl border border-border/80 bg-card px-4 py-3 text-base leading-6 text-foreground shadow-[var(--shadow-soft)] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground focus:border-primary/45 focus:ring-2 focus:ring-ring/20"
            />
            <span className="mt-1.5 block text-right text-xs text-muted-foreground">
              {bio.length}/180
            </span>
          </label>
          <SelectableChips
            label="Interests"
            options={INTERESTS}
            selected={interests}
            onChange={setInterests}
          />
          <SelectableChips
            label="Looking For"
            options={LOOKING_FOR}
            selected={lookingFor}
            onChange={setLookingFor}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={finishSetup}
          disabled={isSaving}
          className="gradient-brand mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-5 font-display text-sm font-semibold text-primary-foreground shadow-[var(--shadow-raised)] transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_22px_oklch(0.546_0.215_262.9_/_0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Finish Setup"}
          <Check className="size-4" aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}

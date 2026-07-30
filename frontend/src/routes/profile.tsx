import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, LogOut, Pencil, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AvatarPlaceholder } from "@/components/linkup/Avatar";
import { BottomNavigation } from "@/components/linkup/BottomNavigation";
import { PrimaryButton, SecondaryButton } from "@/components/linkup/Button";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrors } from "@/services/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — LinkUp" },
      { name: "description", content: "Your LinkUp networking profile." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<File>();
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [avatarError, setAvatarError] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview],
  );

  if (!user) return null;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const displayName = fullName || user.username;
  const professionalSummary = [user.profession, user.company]
    .filter(Boolean)
    .join(" · ");

  const selectAvatar = (file?: File) => {
    if (!file) return;
    setAvatarError("");
    setPendingAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const cancelAvatarChange = () => {
    setPendingAvatar(undefined);
    setAvatarPreview(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveAvatar = async () => {
    if (!pendingAvatar) return;
    setIsSavingAvatar(true);
    setAvatarError("");
    try {
      const payload = new FormData();
      payload.set("avatar", pendingAvatar);
      await updateProfile(payload);
      cancelAvatarChange();
    } catch (requestError) {
      const errors = getApiErrors(requestError);
      setAvatarError(errors.avatar ?? "Unable to upload your profile picture.");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    setIsSavingAvatar(true);
    setAvatarError("");
    try {
      await updateProfile({ avatar: null });
      cancelAvatarChange();
    } catch (requestError) {
      const errors = getApiErrors(requestError);
      setAvatarError(errors.avatar ?? "Unable to remove your profile picture.");
    } finally {
      setIsSavingAvatar(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      await navigate({ to: "/auth", replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${displayName} on LinkUp`,
        text: `Connect with ${displayName} on LinkUp.`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto min-h-screen max-w-md pb-28">
        <header className="flex items-center justify-between px-5 pb-4 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              LinkUp
            </p>
            <h1 className="mt-1 font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
              Profile
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void shareProfile()}
            aria-label="Share profile"
            className="flex size-11 items-center justify-center rounded-full bg-card text-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="size-5" />
          </button>
        </header>

        <main className="space-y-7 px-5">
          <section className="surface-card relative overflow-hidden rounded-[1.75rem] border border-border/70 px-5 pb-5 pt-6 text-center">
            <div className="pointer-events-none absolute -right-12 -top-14 size-36 rounded-full bg-secondary/12 blur-3xl" />
            <div className="relative">
              <div className="mx-auto w-fit overflow-hidden rounded-full bg-card p-1.5 shadow-[var(--shadow-raised)]">
                <AvatarPlaceholder
                  name={displayName}
                  imageUrl={avatarPreview ?? user.avatar}
                  size="xl"
                />
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => selectAvatar(event.target.files?.[0])}
                  className="sr-only"
                  aria-label="Choose profile picture"
                />
                <SecondaryButton
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSavingAvatar}
                  className="h-10 rounded-xl bg-primary/8 px-3 text-xs"
                >
                  <Camera className="size-4" />
                  {user.avatar || avatarPreview
                    ? "Change photo"
                    : "Upload photo"}
                </SecondaryButton>
                {user.avatar && !pendingAvatar && (
                  <SecondaryButton
                    type="button"
                    onClick={() => void removeAvatar()}
                    disabled={isSavingAvatar}
                    className="h-10 rounded-xl px-3 text-xs text-destructive"
                  >
                    <X className="size-4" />
                    Remove
                  </SecondaryButton>
                )}
              </div>
              {pendingAvatar && (
                <div className="mt-3 flex justify-center gap-2">
                  <SecondaryButton
                    type="button"
                    onClick={cancelAvatarChange}
                    disabled={isSavingAvatar}
                    className="h-10 rounded-xl px-3 text-xs"
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    type="button"
                    onClick={() => void saveAvatar()}
                    disabled={isSavingAvatar}
                    className="h-10 min-h-10 rounded-xl px-3 text-xs"
                  >
                    {isSavingAvatar ? "Uploading..." : "Save photo"}
                  </PrimaryButton>
                </div>
              )}
              {avatarError && (
                <p
                  role="alert"
                  className="mt-3 text-xs font-medium text-destructive"
                >
                  {avatarError}
                </p>
              )}
              <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
                {displayName}
              </h2>
              {professionalSummary && (
                <p className="mt-1 text-sm font-semibold text-primary">
                  {professionalSummary}
                </p>
              )}
              <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
                {user.bio ||
                  "Add a short bio so the right people can find you."}
              </p>
              <div className="mt-5 flex gap-2">
                <SecondaryButton
                  onClick={() => void navigate({ to: "/complete-profile" })}
                  className="h-11 flex-1 rounded-xl bg-primary/8 text-xs"
                >
                  <Pencil className="size-4" />
                  Edit Profile
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => void shareProfile()}
                  className="h-11 min-h-11 flex-1 rounded-xl text-xs"
                >
                  <Share2 className="size-4" />
                  Share Profile
                </PrimaryButton>
              </div>
            </div>
          </section>

          <section aria-labelledby="account-title">
            <h2
              id="account-title"
              className="mb-3 font-display text-lg font-semibold tracking-tight"
            >
              Account
            </h2>
            <div className="surface-card overflow-hidden rounded-[1.45rem] border border-border/70 p-4">
              <dl className="space-y-4 text-left">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Username
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {user.username}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Email
                  </dt>
                  <dd className="mt-1 break-all text-sm font-semibold text-foreground">
                    {user.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">
                    {user.phone}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <ProfileTags
            title="Interests"
            description="The topics that spark your best conversations."
            values={user.interests}
          />
          <ProfileTags
            title="Looking For"
            description="Let people know how they can help."
            values={user.looking_for}
          />

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/8 px-5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-70"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </main>
      </div>
      <BottomNavigation
        activeId="profile"
        onChange={(id) => {
          if (id === "home") void navigate({ to: "/home" });
          if (id === "events") void navigate({ to: "/" });
          if (id === "discover") void navigate({ to: "/discover" });
          if (id === "connections") void navigate({ to: "/connections" });
        }}
      />
    </div>
  );
}

function ProfileTags({
  title,
  description,
  values,
}: {
  title: string;
  description: string;
  values: string[];
}) {
  return (
    <section aria-label={title}>
      <h2 className="font-display text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
        {description}
      </p>
      <div className="surface-card mt-4 rounded-[1.45rem] border border-border/70 p-4">
        {values.length ? (
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <span
                key={value}
                className="rounded-full bg-primary/8 px-3 py-2 text-xs font-bold text-primary"
              >
                {value}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add preferences to improve your LinkUp recommendations.
          </p>
        )}
      </div>
    </section>
  );
}

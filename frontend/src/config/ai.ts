const avatarUrl = import.meta.env.VITE_DID_AVATAR_URL?.trim();

export const aiConfig = {
  avatarUrl: avatarUrl || undefined,
};

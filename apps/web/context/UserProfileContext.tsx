"use client";

import { createContext, useContext, useState } from "react";

interface UserProfileContextValue {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  fullName: string;
  setFullName: (name: string) => void;
}

const UserProfileContext = createContext<UserProfileContextValue>({
  avatarUrl: null,
  setAvatarUrl: () => {},
  fullName: "",
  setFullName: () => {},
});

interface UserProfileProviderProps {
  children: React.ReactNode;
  initialFullName?: string;
  initialAvatarUrl?: string | null;
}

export function UserProfileProvider({
  children,
  initialFullName = "",
  initialAvatarUrl = null,
}: UserProfileProviderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [fullName, setFullName] = useState(initialFullName);

  return (
    <UserProfileContext.Provider value={{ avatarUrl, setAvatarUrl, fullName, setFullName }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}

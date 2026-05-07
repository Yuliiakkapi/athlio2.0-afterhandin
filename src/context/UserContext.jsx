import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ notifications: 0, messages: 0 });

  const isScout = profile?.role === "scout";
  const canPost = (postType) => {
    if (!user) return false;
    if (postType === "match" || postType === "activity") return !isScout;
    return true;
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, profile, setProfile, loading, counts, setCounts, isScout, canPost }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

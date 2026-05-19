import { createContext, useContext, useState } from "react";
import { ALL_CHALLENGES } from "../data/challenges";

const ChallengesContext = createContext(null);

export function ChallengesProvider({ children }) {
  const [challenges, setChallenges] = useState(ALL_CHALLENGES);

  function joinChallenge(id) {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "accepted" } : c))
    );
  }

  return (
    <ChallengesContext.Provider value={{ challenges, joinChallenge }}>
      {children}
    </ChallengesContext.Provider>
  );
}

export function useChallenges() {
  return useContext(ChallengesContext);
}

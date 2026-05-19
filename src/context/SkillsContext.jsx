import { createContext, useContext, useState } from "react";

const DEFAULTS = {
  dribbling: 5, passing: 5, shot_power: 5,
  ball_control: 5, tackling: 5, anticipation: 5,
};

const SkillsContext = createContext(null);

export function SkillsProvider({ children }) {
  const [skills, setSkills] = useState(DEFAULTS);
  return (
    <SkillsContext.Provider value={{ skills, setSkills }}>
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  return useContext(SkillsContext);
}

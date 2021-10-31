import type { LpadderProject } from "../types/LpadderProjects";
import React, { createContext, useState } from "react";

type CurrentProjectContextType = {
  currentProject: LpadderProject | null;
  setCurrentProject: (value: LpadderProject) => void;
};

export const CurrentProjectContext = createContext<CurrentProjectContextType | undefined>(
  undefined
);

export const CurrentProjectContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [currentProject, setCurrentProject] = useState<LpadderProject | null>(null);

  return (
    <CurrentProjectContext.Provider value={{ currentProject, setCurrentProject }}>
      {children}
    </CurrentProjectContext.Provider>
  );
};
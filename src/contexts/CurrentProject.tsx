import type { LpadderProject } from "../types/LpadderProjects";
import React, { createContext, useState, useContext } from "react";

type CurrentProjectContextType = {
  currentProject: LpadderProject | null;
  setCurrentProject: (value: LpadderProject) => void;
};

export const CurrentProjectContext = createContext<CurrentProjectContextType | null>(
  null
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

export const useCurrentProject = () => useContext(CurrentProjectContext);
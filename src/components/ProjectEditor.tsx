import type {
  ProjectStructure
} from "@/types/Project";

import { useLocalProjectStore } from "@/pages/projects/slug";

import { useEffect } from "react";

type ProjectEditorProps = {
  saveProjectLocally: (data: ProjectStructure) => void;
};

export default function ProjectPlay ({
  saveProjectLocally
}: ProjectEditorProps) {
  const data = useLocalProjectStore(state => state.projectLocalData);

  useEffect(() => {
    console.group("[ProjectEditor][useEffect]");
    console.info("Got 'projectLocalData' from local state !", data);
    console.groupEnd();
  }, []);
  
  if (!data) return <p>Loading...</p>;

  return (
    <div>      
      <p>Timeline</p>
      <div
        className="flex flex-col  w-full bg-blue-600"
      >
        <div className="w-full h-26">

        </div>
      </div>
    </div>
  );
}

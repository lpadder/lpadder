import type {
  ProjectStructure
} from "@/types/Project";

import { FormEvent, useState } from "react";
import Input from "@/components/Input";

type ProjectSettingsProps = {
  data: ProjectStructure;
  saveProjectLocally: (data: ProjectStructure) => Promise<{
    slug: string;
    project: ProjectStructure;
  } | undefined>;
  saveProjectGlobally: (data: ProjectStructure) => Promise<void>;
};

export default function ProjectSettings ({
  data,
  saveProjectLocally, saveProjectGlobally
}: ProjectSettingsProps) {
  const [newName, setNewName] = useState(data.name);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await saveProjectGlobally ({
      ...data,
      name: newName
    });
  };
  
  return (
    <div>
      <h1>Current settings</h1>
      <form onSubmit={handleSave}>
        <Input
          labelName="Project name"
          placeholder={data.name}
          onChange={(e) => setNewName(e.target.value)}
          value={newName}
        />

        <button
          type="submit"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
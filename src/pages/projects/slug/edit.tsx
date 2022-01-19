import type {
  ProjectStructure
} from "@/types/Project";

type ProjectEditProps = { data: ProjectStructure };
export default function ProjectEdit({ data }: ProjectEditProps) {
  
  return (
    <div>
      <h1>Editor</h1>
      {JSON.stringify(data)}
    </div>
  );
}
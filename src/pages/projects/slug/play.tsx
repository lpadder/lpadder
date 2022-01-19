import type {
  ProjectStructure
} from "@/types/Project";

type ProjectPlayProps = { data: ProjectStructure };
export default function ProjectPlay({ data }: ProjectPlayProps) {

  return (
    <div>
      <h1>Play</h1>
      {JSON.stringify(data)}
    </div>
  );
}
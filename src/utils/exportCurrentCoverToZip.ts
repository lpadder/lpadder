import type { ProjectStructure } from "@/types/Project";
import JSZip from "jszip";

import { currentProjectStore } from "@/stores/current_project";
import downloadBlob from "@/utils/downloadBlob";

export default async function exportCurrentCoverToZip ( ) {
  const current_project = currentProjectStore;

  const project_metadata = current_project.metadata;
  const project_data = current_project.data;

  if (!project_data || !project_metadata || !current_project.slug) {
    return console.error(
      "[exportCurrentCoverToZip] Cannot export to ZIP the cover: "
      + "wasn't able to get the current project."
    );
  }

  const project: ProjectStructure = {
    data: project_data,
    metadata: project_metadata
  };

  const zip = new JSZip();
  zip.file("cover.json", JSON.stringify(project, null, 2));

  const blob = await zip.generateAsync({ type: "uint8array" });
  downloadBlob(blob, `${current_project.slug}.zip`, "application/zip");
}

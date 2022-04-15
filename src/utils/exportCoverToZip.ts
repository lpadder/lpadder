import type { ProjectStructure } from "@/types/Project";

import JSZip from "jszip";

import { storedProjectsData } from "@/stores/projects_data";
import { storedProjectsMetadata } from "@/stores/projects_metadata";

import downloadBlob from "@/utils/downloadBlob";

export default async function exportCoverToZip (slug: string) {
  const project_metadata = await storedProjectsMetadata.getProjectMetadataFromSlug(slug);
  const project_data = await storedProjectsData.getProjectDataFromSlug(slug);


  if (!project_data.success || !project_metadata.success) return console.error(
    "[exportCoverToZip] Cannot export to ZIP the cover: wasn't able to get the project data."
  );

  const project: ProjectStructure = {
    data: project_data.data,
    metadata: project_metadata.data
  };

  const zip = new JSZip();
  zip.file("cover.json", JSON.stringify(project, null, 2));

  const blob = await zip.generateAsync({ type: "uint8array" });
  downloadBlob(blob, `${slug}.zip`, "application/zip");

}
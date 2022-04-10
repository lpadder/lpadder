import JSZip from "jszip";

import { storedProjects } from "@/stores/projects";
import downloadBlob from "@/utils/downloadBlob";

export default async function exportCoverToZip (slug: string) {
  const project = await storedProjects.getProjectFromSlug(slug);

  if (!project.success) return console.error(
    "[exportCoverToZip] Cannot export to ZIP the cover: wasn't able to get the project data."
  );

  const zip = new JSZip();
  zip.file("cover.json", JSON.stringify(project.data, null, 2));

  const blob = await zip.generateAsync({ type: "uint8array" });
  downloadBlob(blob, `${slug}.zip`, "application/zip");

}
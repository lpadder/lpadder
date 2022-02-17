import JSZip from "jszip";

import stores from "@/stores";
import downloadBlob from "@/utils/downloadBlob";

export default async function exportCoverToZip (slug: string) {
  const [success, data] = await stores.projects.getProjectFromSlug(slug);

  if (!success) return console.error(
    "Cannot export to ZIP the cover: wasn't able to get the project data.",
    data // Here, 'data' is the error message.
  );

  const zip = new JSZip();
  zip.file("cover.json", JSON.stringify(data, null, 2));

  const blob = await zip.generateAsync({ type: "uint8array" });
  downloadBlob(blob, `${slug}.zip`, "application/zip");

}
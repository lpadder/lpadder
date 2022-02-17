export default function downloadBlob (
  data: Uint8Array,
  fileName = "converted",
  type: string
) {
  const blob = new Blob([data], { type });

  // Creating an element to auto-download the file.
  const url = window.URL.createObjectURL(blob);
  const aInput = document.createElement("a");

  aInput.setAttribute("href", url);
  aInput.setAttribute("download", fileName);
  
  // Append it to the DOM.
  document.body.appendChild(aInput);
  aInput.style.display = "none";

  // Download href and remove the element.
  aInput.click();
  aInput.remove();

  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}
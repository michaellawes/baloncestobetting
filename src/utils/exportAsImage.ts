import html2canvas from "html2canvas-pro";

const exportAsImage = async (
  element: HTMLDivElement,
  imageFileName: string,
) => {
  // @ts-ignore
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
};

export const downloadImage = async (blob: string, imageFileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.download = imageFileName;

  fakeLink.href = blob;
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  fakeLink.remove();
};

export default exportAsImage;

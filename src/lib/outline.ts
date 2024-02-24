import { imageDataToDataUrl, loadImageWithSource } from "./utils";

export function addOutlineImageData(
  image: ImageData,
  imageSource: CanvasImageSource,
  color: string,
  width: number,
) {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("canvas context error");
  }
  ctx.fillStyle = color;
  for (let x = 0; x < image.width; x++) {
    for (let y = 0; y < image.height; y++) {
      const index = (y * image.width + x) * 4;
      const alpha = image.data[index + 3];
      if (alpha > 20) {
        ctx.beginPath()
        ctx.arc(x, y, width, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.drawImage(imageSource, 0, 0);
  return ctx.getImageData(0, 0, image.width, image.height);
}

export async function addOutline(imagePath: string, color: string, width: number) {
  const { imageData, imageSource } = await loadImageWithSource(imagePath);
  const outlineImageData = addOutlineImageData(imageData, imageSource, color, width);
  return imageDataToDataUrl(outlineImageData);
}

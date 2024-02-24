import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function loadImageWithSource(path: string) {
  const image = new Image();
  image.src = path;
  await new Promise((resolve) => {
    image.onload = resolve;
  });
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }
  ctx.drawImage(image, 0, 0);
  return {
    imageData: ctx.getImageData(0, 0, image.width, image.height),
    imageSource: image,
  };
}

export async function loadImageOriginalScale(path: string) {
  const { imageData } = await loadImageWithSource(path);
  return imageData;
}

export async function imageDataToDataUrl(image: ImageData) {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.putImageData(image, 0, 0);
  const blob = await canvas.convertToBlob();
  return URL.createObjectURL(blob);
}

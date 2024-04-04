import { Tensor } from "onnxruntime-common";
import * as ort from "onnxruntime-web";
import { TypedTensor } from "onnxruntime-web";
import u2netp from "../assets/u2netp.onnx?url";

async function getImageTensorFromPath(
  path: string,
  dims: number[] = [1, 3, 320, 320]
) {
  const image = await loadImagefromPath(path, dims[2], dims[3]);
  return Tensor.fromImage(image, { dataType: "float32" });
}

async function loadImagefromPath(
  path: string,
  width: number = 320,
  height: number = 320
) {
  const image = new Image(width, height);
  image.src = path;
  await new Promise((resolve) => {
    image.onload = resolve;
  });
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.drawImage(image, 0, 0, width, height);

  return ctx.getImageData(0, 0, width, height);
}

export function setOpacityWithThreshold(
  image: ImageData,
  tensor: TypedTensor<"float32">,
  threshold: number
) {
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const index = (y * image.width + x) * 4;
      const value = tensorBilinearSample(
        tensor,
        (tensor.dims[2] * x) / image.width,
        (tensor.dims[3] * y) / image.height
      );
      image.data[index + 3] = value < threshold ? 0 : 255;
    }
  }
}

function tensorBilinearSample(
  tensor: TypedTensor<"float32">,
  x: number,
  y: number
) {
  const [width, height] = [tensor.dims[2], tensor.dims[3]];
  const x0 = Math.floor(x);
  const x1 = Math.min(width - 1, x0 + 1);
  const y0 = Math.floor(y);
  const y1 = Math.min(height - 1, y0 + 1);
  return lerp(
    lerp(tensor.data[y0 * width + x0], tensor.data[y0 * width + x1], x - x0),
    lerp(tensor.data[y1 * width + x0], tensor.data[y1 * width + x1], x - x0),
    y - y0
  );
}

function lerp(v0: number, v1: number, t: number) {
  return (1 - t) * v0 + t * v1;
}

export async function runU2NetModel(preprocessedData: Tensor) {
  const session = await ort.InferenceSession.create(u2netp, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });
  return session.run({ "input.1": preprocessedData });
}

export async function getBackgroundTensor(path: string) {
  const data = await getImageTensorFromPath(path);
  const result = await runU2NetModel(data);
  return Object.entries(result).reduce((min, [key, value]) =>
    parseInt(key) < parseInt(min[0]) ? [key, value] : min
  )[1] as TypedTensor<"float32">;
}

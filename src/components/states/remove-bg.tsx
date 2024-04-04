import { MachineContext } from "@/lib/machine";
import { useImage } from "@/lib/use-image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CardContent, CardFooter } from "../ui/card";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { TypedTensor } from "onnxruntime-web";
import { getBackgroundTensor, setOpacityWithThreshold } from "@/lib/removeBg";
import { cn } from "@/lib/utils";

const RemoveBg = () => {
  const [threshold, setThreshold] = useState(0.1);
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useImage();
  const { send } = MachineContext.useActorRef();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  )!;
  const [backgroundTensor, setBackgroundTensor] =
    useState<TypedTensor<"float32">>();

  useEffect(() => {
    let canceled = false;

    getBackgroundTensor(imagePath)
      .then((result) => {
        if (canceled) return;
        setBackgroundTensor(result);
      })
      .catch(() => send({ type: "error" }));

    return () => {
      canceled = true;
    };
  }, [imagePath, send]);

  const origImage = useMemo(() => {
    if (!image) return null;
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.width, image.height);
  }, [image]);

  useEffect(() => {
    if (!origImage || !canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    if (!backgroundTensor) {
      ctx.putImageData(origImage, 0, 0);
      return;
    }
    const imageData = new ImageData(
      origImage.data,
      origImage.width,
      origImage.height
    );
    setOpacityWithThreshold(imageData, backgroundTensor, threshold);
    ctx.putImageData(imageData, 0, 0);
  }, [origImage, backgroundTensor, threshold]);

  const onCancel = () => send({ type: "back" });
  const onApply = () => {
    if (!canvas.current) return;
    send({ type: "done", newImagePath: canvas.current.toDataURL() });
  };

  return (
    <>
      <CardContent>
        <div className="bg-[url('/checkers.svg')]">
          <canvas
            className={cn("max-w-full mx-auto my-2", {
              "animate-pulse": !backgroundTensor,
            })}
            width={image?.width}
            height={image?.height}
            ref={canvas}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Slider
          value={[threshold]}
          onValueChange={(value) => setThreshold(value[0])}
          min={0.001}
          max={1}
          step={0.001}
        />
        <div className="flex gap-1.5 self-end">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onApply}>Apply</Button>
        </div>
      </CardFooter>
    </>
  );
};

export default RemoveBg;
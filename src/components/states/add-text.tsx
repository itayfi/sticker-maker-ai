import { MachineContext } from "@/lib/machine";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { ColorPicker, colors } from "../color-picker";

export const AddText = () => {
  const [color, setColor] = useState(colors[0]);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [textPosition, setTextPosition] = useState<[number, number]>([0, 0]);
  const { send } = MachineContext.useActorRef();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  )!;
  const canvas = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const newImage = new Image();
    const handler = () => {
      setImage(newImage);
      setTextPosition([newImage.width / 2, newImage.height / 2]);
    };
    newImage.addEventListener("load", handler);
    newImage.src = imagePath;

    return () => newImage.removeEventListener("load", handler);
  }, [imagePath]);

  useEffect(() => {
    if (!image || !canvas.current) return;
    const ctx = canvas.current.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.drawImage(image, 0, 0);
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, ...textPosition);
  }, [image, color, canvas, text, fontSize, textPosition]);

  const onCancel = () => send({ type: "back" });
  const onApply = () => {
    if (!canvas.current) return;
    send({ type: "done", newImagePath: canvas.current.toDataURL() });
  };
  const onKeyUp = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === "Backspace") {
      setText((t) => t.slice(0, -1));
    } else if (e.key.length === 1) {
      setText((t) => t + e.key);
    }
  };
  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    setFontSize((s) => s + e.deltaY);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!e.buttons || !canvas.current) return;
    console.log([e.movementX, e.movementY]);
    const ratio = canvas.current.width / canvas.current.clientWidth;
    setTextPosition(([x, y]) => [
      x + ratio * e.movementX,
      y + ratio * e.movementY,
    ]);
  };

  return (
    <>
      <CardContent>
        <canvas
          ref={canvas}
          width={image?.width}
          height={image?.height}
          onKeyUp={onKeyUp}
          onWheel={onWheel}
          onMouseMove={onMouseMove}
          className="max-w-full mx-auto my-2 bg-[url('/checkers.svg')]"
          tabIndex={1}
        />
      </CardContent>
      <CardFooter className="gap-1.5">
        <ColorPicker color={color} setColor={setColor} />
        <Button variant="secondary" onClick={onCancel} className="ml-auto">
          Cancel
        </Button>
        <Button onClick={onApply}>Apply</Button>
      </CardFooter>
    </>
  );
};

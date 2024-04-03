import { MachineContext } from "@/lib/machine";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { ColorPicker, colors } from "../color-picker";
import { SquarePen } from "lucide-react";

export const AddText = () => {
  const [color, setColor] = useState(colors[0]);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [textPosition, setTextPosition] = useState<[number, number]>([0, 0]);
  const [textStroke, setTextStroke] = useState<string>();
  const { send } = MachineContext.useActorRef();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  )!;
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useRef<HTMLInputElement>(null);
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
    if (textStroke) {
      ctx.strokeStyle = textStroke;
      ctx.lineWidth = fontSize * 0.1;
      ctx.strokeText(text, ...textPosition);
    }
    ctx.fillText(text, ...textPosition);
  }, [image, color, canvas, text, fontSize, textPosition, textStroke]);

  useEffect(() => {
    canvas.current?.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        setFontSize((s) => s + e.deltaY);
      },
      { passive: false }
    );
  }, [canvas.current]);

  const onCancel = () => send({ type: "back" });
  const onApply = () => {
    if (!canvas.current) return;
    send({ type: "done", newImagePath: canvas.current.toDataURL() });
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!e.buttons || !canvas.current) return;

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
          onMouseMove={onMouseMove}
          onClick={() => input.current?.focus()}
          className="max-w-full mx-auto my-2 bg-[url('/checkers.svg')]"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="opacity-0 absolute"
          ref={input}
        />
      </CardContent>
      <CardFooter className="gap-1.5">
        <ColorPicker color={color} setColor={setColor} />
        <Button
          variant="secondary"
          size="icon"
          className="ml-3"
          onClick={() =>
            setTextStroke((value) =>
              value
                ? { "#000000": "#ffffff", "#ffffff": undefined }[value]
                : "#000000"
            )
          }
        >
          <SquarePen />
        </Button>
        <Button variant="secondary" onClick={onCancel} className="ml-auto">
          Cancel
        </Button>
        <Button onClick={onApply}>Apply</Button>
      </CardFooter>
    </>
  );
};

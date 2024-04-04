import { MachineContext } from "@/lib/machine";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { ColorPicker, colors } from "../color-picker";
import { SquarePen } from "lucide-react";
import interact from "interactjs";
import { useImage } from "@/lib/use-image";

export const AddText = () => {
  const [color, setColor] = useState(colors[0]);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [textRotation, setTextRotation] = useState(0);
  const [textPosition, setTextPosition] = useState<[number, number]>([0, 0]);
  const [textStroke, setTextStroke] = useState<string>();
  const { send } = MachineContext.useActorRef();
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const image = useImage();

  useEffect(() => {
    if (!image || !canvas.current) return;
    const ctx = canvas.current.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.drawImage(image, 0, 0);
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(...textPosition);
    ctx.rotate((Math.PI * textRotation) / 180);
    if (textStroke) {
      ctx.strokeStyle = textStroke;
      ctx.lineWidth = fontSize * 0.1;
      ctx.strokeText(text, 0, 0);
    }
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }, [
    image,
    color,
    canvas,
    text,
    fontSize,
    textPosition,
    textStroke,
    textRotation,
  ]);

  useEffect(() => {
    if (image) {
      setTextPosition([image.width / 2, image.height / 2]);
    }
  }, [image]);

  useEffect(() => {
    canvas.current?.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        setFontSize((s) => s - e.deltaY);
      },
      { passive: false }
    );
  }, []);

  useEffect(() => {
    if (!canvas.current) return;

    interact(canvas.current)
      .gesturable({
        listeners: {
          move: (e) => {
            if (!canvas.current) return;

            setFontSize((s) => s * (1 + e.ds));
            setTextRotation((r) => r + e.da);
          },
        },
      })
      .draggable({
        listeners: {
          move: (e) => {
            if (!canvas.current) return;

            const ratio = canvas.current.width / canvas.current.clientWidth;
            setTextPosition(([x, y]) => [x + ratio * e.dx, y + ratio * e.dy]);
          },
        },
      });
  }, []);

  const onCancel = () => send({ type: "back" });
  const onApply = () => {
    if (!canvas.current) return;
    send({ type: "done", newImagePath: canvas.current.toDataURL() });
  };

  return (
    <>
      <CardContent>
        <canvas
          ref={canvas}
          width={image?.width}
          height={image?.height}
          onClick={() => input.current?.focus()}
          className="max-w-full mx-auto my-2 bg-[url('/checkers.svg')] touch-none"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="opacity-0 absolute"
          ref={input}
        />
      </CardContent>
      <CardFooter className="gap-1.5 flex-wrap">
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

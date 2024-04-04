import { MachineContext } from "@/lib/machine";
import { CardContent, CardFooter } from "../ui/card";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { ColorPicker, colors } from "../color-picker";
import {
  OutlinePreview,
  OutlinePreviewMethods,
} from "../outline/outline-preview";
import { useImage } from "@/lib/use-image";

const OutlineEditting = () => {
  const [color, setColor] = useState(colors[0]);
  const [outline, setOutline] = useState(3);
  const canvas = useRef<OutlinePreviewMethods>(null);
  const { send } = MachineContext.useActorRef();
  const image = useImage();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  )!;

  const onApply = () => {
    const newImagePath = canvas.current?.getDataURL();
    if (newImagePath) {
      send({ type: "done", newImagePath });
    }
  };
  const onCancel = () => send({ type: "back" });

  return (
    <>
      <CardContent>
        {image ? (
          <OutlinePreview
            image={image}
            color={color}
            outlineWidth={outline}
            ref={canvas}
          />
        ) : (
          <img
            className="mx-auto my-2 bg-[url('/checkers.svg')]"
            src={imagePath}
          />
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <ColorPicker color={color} setColor={setColor} />
        <Slider
          value={[outline]}
          onValueChange={(value) => setOutline(value[0])}
          min={1}
          max={20}
          step={1}
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

export default OutlineEditting;
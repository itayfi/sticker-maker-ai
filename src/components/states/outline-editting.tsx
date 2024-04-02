import { MachineContext } from "@/lib/machine";
import { CardContent, CardFooter } from "../ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { addOutline } from "@/lib/outline";
import { ColorPicker, colors } from "../color-picker";

export const OutlineEditting = () => {
  const [color, setColor] = useState(colors[0]);
  const [outline, setOutline] = useState(3);
  const [loading, setLoading] = useState(false);
  const { send } = MachineContext.useActorRef();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  )!;

  const onApply = () => {
    setLoading(true);
    addOutline(imagePath, color, outline)
      .then((newImagePath) => send({ type: "done", newImagePath }))
      .catch((err) => {
        console.error(err);
        send({ type: "back" });
      })
      .finally(() => setLoading(false));
  };
  const onCancel = () => send({ type: "back" });

  return (
    <>
      <CardContent>
        <img
          className="mx-auto my-2 bg-[url('/checkers.svg')]"
          src={imagePath}
        />
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
          <Button
            onClick={onApply}
            disabled={loading}
            className={cn({ "animate-pulse": loading })}
          >
            Apply
          </Button>
        </div>
      </CardFooter>
    </>
  );
};

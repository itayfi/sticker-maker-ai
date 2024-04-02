import { MachineContext } from "@/lib/machine";
import { CardContent, CardFooter } from "../ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { addOutline } from "@/lib/outline";

const colors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#ff00ff",
];

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
        send({ type: "error" });
      })
      .finally(() => setLoading(false));
  };
  const onCancel = () => send({ type: "error" });

  return (
    <>
      <CardContent>
        <img
          className="mx-auto my-2 bg-[url('/checkers.svg')]"
          src={imagePath}
        />
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className="flex gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              className={cn("w-5 h-5 rounded-full border border-border", {
                "ring-2 ring-offset-1 ring-offset-card ring-ring": c === color,
              })}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
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

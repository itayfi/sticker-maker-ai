import { MachineContext } from "@/lib/machine";
import { addOutline } from "@/lib/outline";
import { removeBg } from "@/lib/removeBg";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ImageDown, ImageMinus, PencilLine } from "lucide-react";

export const ImageEditting = () => {
  const { send } = MachineContext.useActorRef();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  );

  const onRemoveBg = async () => {
    if (!imagePath) {
      return;
    }
    send({ type: "remove-bg" });
    removeBg(imagePath)
      .then((newImagePath) =>
        send({
          type: "done",
          newImagePath,
        })
      )
      .catch(() => send({ type: "error" }));
  };

  const onAddOutline = () => {
    if (!imagePath) {
      return;
    }
    send({ type: "add-outline" });
    addOutline(imagePath, "white", 5)
      .then((newImagePath) =>
        send({
          type: "done",
          newImagePath,
        })
      )
      .catch(() => send({ type: "error" }));
  };

  if (!imagePath) {
    return null;
  }

  return (
    <>
      <CardContent>
        <img
          className="mx-auto my-2 bg-[url('/checkers.svg')]"
          src={imagePath}
        />
      </CardContent>
      <CardFooter className="gap-1.5 flex-wrap">
        <Button onClick={onRemoveBg} variant="outline">
          <ImageMinus className="mr-2 size-4" />
          Remove BG
        </Button>
        <Button variant="outline" onClick={onAddOutline}>
          <PencilLine className="mr-2 size-4" />
          Outline
        </Button>
        {/* <Button variant="outline">
      <TextCursorInput className="mr-2 size-4" />
      Add Text
    </Button> */}
        <Button variant="outline" asChild>
          <a href={imagePath} download>
            <ImageDown className="mr-2 size-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </>
  );
};

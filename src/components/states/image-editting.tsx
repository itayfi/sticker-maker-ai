import { MachineContext } from "@/lib/machine";
import { CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import {
  ImageDown,
  ImageMinus,
  PencilLine,
  TextCursorInput,
} from "lucide-react";

export const ImageEditting = () => {
  const { send } = MachineContext.useActorRef();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  );

  const onRemoveBg = async () => {
    send({ type: "remove-bg" });
  };

  const onAddOutline = () => {
    send({ type: "add-outline" });
  };

  const onAddText = () => {
    send({ type: "add-text" });
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
        <Button variant="outline" onClick={onAddText}>
          <TextCursorInput className="mr-2 size-4" />
          Add Text
        </Button>
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

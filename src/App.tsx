import { removeBg } from "./lib/removeBg";
import { FileUpload } from "./components/file-upload";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  ChevronLeft,
  ImageDown,
  ImageMinus,
  Loader2,
  PencilLine,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { Settings } from "./components/settings";
import { AiGenerate } from "./components/ai-generate";
import { Separator } from "./components/ui/separator";
import { addOutline } from "./lib/outline";
import { machine } from "./lib/machine";
import { useMachine } from "@xstate/react";

function App() {
  const [state, send] = useMachine(machine);

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    send({
      type: "file-upload",
      newImagePath: URL.createObjectURL(e.target.files[0]),
    });
  };

  const onRemoveBg = async () => {
    const imagePath = state.context.imagePath;
    if (!imagePath) {
      return;
    }
    try {
      send({ type: "remove-bg" });
      send({
        type: "done",
        newImagePath: await removeBg(imagePath),
      });
    } catch (e) {
      send({ type: "error" });
    }
  };

  const onAddOutline = async () => {
    const imagePath = state.context.imagePath;
    if (!imagePath) {
      return;
    }
    try {
      send({ type: "add-outline" });
      send({
        type: "done",
        newImagePath: await addOutline(imagePath, "white", 5),
      });
    } catch (e) {
      send({ type: "error" });
    }
  };

  const isPending = state.hasTag("loading");
  return (
    <div className="container my-10 mx-auto px-3 max-w-xl">
      <Card
        className={cn("relative overflow-clip", {
          "pointer-events-none": isPending,
        })}
      >
        <CardHeader className="flex flex-row items-center gap-1 space-y-0">
          {state.context.imagePath ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => send({ type: "back" })}
            >
              <ChevronLeft />
            </Button>
          ) : null}
          <CardTitle>Sticker Maker AI</CardTitle>
          <div className="flex-grow" />
          <Settings />
        </CardHeader>
        {state.context.imagePath ? (
          <>
            <CardContent>
              <img
                className="mx-auto my-2 bg-[url('/checkers.svg')]"
                src={state.context.imagePath}
              />
            </CardContent>
            <CardFooter className="gap-1.5 flex-wrap">
              <Button
                onClick={onRemoveBg}
                disabled={!state.context.imagePath}
                variant="outline"
              >
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
                <a href={state.context.imagePath} download>
                  <ImageDown className="mr-2 size-4" />
                  Download
                </a>
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <FileUpload accept="image/*" onChange={onSelectImage} />
            <Separator className="my-6">
              <div className="text-center -translate-y-1/2">
                <span className="px-4 bg-card">OR</span>
              </div>
            </Separator>
            <AiGenerate
              onStart={() => send({ type: "ai-generate" })}
              onError={() => send({ type: "error" })}
              onFinish={(url) => {
                send({ type: "done", newImagePath: url });
              }}
            />
          </CardContent>
        )}
        {isPending && (
          <div className="absolute bg-slate-500/30 w-full h-full top-0 left-0 flex items-center justify-center">
            <Loader2 className="animate-spin size-20" />
          </div>
        )}
      </Card>
    </div>
  );
}

export default App;

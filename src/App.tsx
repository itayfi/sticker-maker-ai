import { Card, CardHeader, CardTitle } from "./components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { Settings } from "./components/settings";
import { MachineContext } from "./lib/machine";
import { InitialState } from "./components/states/initial-state";
import { ImageEditting } from "./components/states/image-editting";
import { OutlineEditting } from "./components/states/outline-editting";
import { AddText } from "./components/states/add-text";
import { RemoveBg } from "./components/states/remove-bg";

function App() {
  const state = MachineContext.useSelector((state) => state);
  const { send } = MachineContext.useActorRef();

  const getComponent = () => {
    if (
      state.matches("Initial state") ||
      (state.matches("Loading") && !state.context.imagePath)
    ) {
      return <InitialState />;
    }
    if (!state.context.imagePath) {
      return null;
    }
    if (state.matches({ "Image Editting": "Editting outline" })) {
      return <OutlineEditting />;
    }
    if (state.matches({ "Image Editting": "Adding text" })) {
      return <AddText />;
    }
    if (state.matches({ "Image Editting": "Removing BG" })) {
      return <RemoveBg />;
    }
    return <ImageEditting />;
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
        {getComponent()}
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

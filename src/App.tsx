import { useState } from "react";
import { removeBg } from "./lib/removeBg";
import { FileUpload } from "./components/file-upload";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";
import { Settings } from "./components/settings";
import { AiGenerate } from "./components/ai-generate";
import { Separator } from "./components/ui/separator";

function App() {
  const [imageSrc, setImageSrc] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setImageSrc(URL.createObjectURL(e.target.files[0]));
  };

  const onRemoveBg = async () => {
    if (!imageSrc) {
      return;
    }
    try {
      setIsPending(true);
      setImageSrc(await removeBg(imageSrc));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container my-10 mx-auto px-3 max-w-xl">
      <Card
        className={cn("relative overflow-clip", {
          "pointer-events-none": isPending,
        })}
      >
        <CardHeader className="flex flex-row items-center gap-1 space-y-0">
          {imageSrc ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setImageSrc(undefined)}
            >
              <ChevronLeft />
            </Button>
          ) : null}
          <CardTitle>Sticker Maker AI</CardTitle>
          <div className="flex-grow" />
          <Settings />
        </CardHeader>
        {imageSrc ? (
          <>
            <CardContent>
              <img
                className="mx-auto my-2 bg-[url('/checkers.svg')]"
                src={imageSrc}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={onRemoveBg} disabled={!imageSrc}>
                Remove BG
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
              onStart={() => setIsPending(true)}
              onError={() => setIsPending(false)}
              onFinish={(url) => {
                setImageSrc(url);
                setIsPending(false);
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

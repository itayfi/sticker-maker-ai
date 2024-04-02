import { Separator } from "@radix-ui/react-select";
import { FileUpload } from "../file-upload";
import { CardContent } from "../ui/card";
import { AiGenerate } from "../ai-generate";
import { MachineContext } from "@/lib/machine";

export const InitialState = () => {
  const { send } = MachineContext.useActorRef();

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    send({
      type: "file-upload",
      newImagePath: URL.createObjectURL(e.target.files[0]),
    });
  };

  return (
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
  );
};

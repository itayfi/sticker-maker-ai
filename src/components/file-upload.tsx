import { FileUp } from "lucide-react";
import { ComponentProps } from "react";

export const FileUpload = (props: ComponentProps<"input">) => (
  <div className="flex items-center justify-center w-full">
    <label
      htmlFor="dropzone-file"
      className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50"
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <FileUp className="size-8 mb-4" />
        <p className="mb-2 text-sm text-card-foreground">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-card-foreground">
          Any image file, recommended size 512x512
        </p>
      </div>
      <input id="dropzone-file" type="file" className="hidden" {...props} />
    </label>
  </div>
);

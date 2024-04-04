import { useEffect, useState } from "react";
import { MachineContext } from "./machine";

export const useImage = () => {
  const [image, setImage] = useState<HTMLImageElement>();
  const imagePath = MachineContext.useSelector(
    (state) => state.context.imagePath
  )!;

  useEffect(() => {
    const newImage = new Image();
    const handler = () => {
      setImage(newImage);
    };
    newImage.addEventListener("load", handler);
    newImage.src = imagePath;

    return () => newImage.removeEventListener("load", handler);
  }, [imagePath]);

  return image;
};

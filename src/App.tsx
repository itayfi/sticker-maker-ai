import { useState } from "react";
import { removeBg } from "./lib/removeBg";

function App() {
  const [imagesSrcs, setImagesSrcs] = useState<string[]>();

  const onSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const orig = URL.createObjectURL(e.target.files[0]);
    setImagesSrcs([orig]);
    setImagesSrcs([orig, await removeBg(orig)]);
  };

  return (
    <div className="container my-10 mx-auto px-3 max-w-3xl">
      <h1 className="text-3xl font-bold text-center">Sticker Maker AI</h1>
      <input type="file" accept="image/*" onChange={onSelectImage} />
      {imagesSrcs && imagesSrcs.map((src, i) => <img key={i} src={src} />)}
    </div>
  );
}

export default App;

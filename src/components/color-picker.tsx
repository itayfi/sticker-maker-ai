import { cn } from "@/lib/utils";

export const colors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#ff00ff",
];

export const ColorPicker = ({
  color, setColor,
}: {
  color: string;
  setColor: (value: string) => void;
}) => (
  <div className="flex gap-1.5">
    {colors.map((c) => (
      <button
        key={c}
        className={cn("w-5 h-5 rounded-full border border-border", {
          "ring-2 ring-offset-1 ring-offset-card ring-ring": c === color,
        })}
        style={{ backgroundColor: c }}
        onClick={() => setColor(c)} />
    ))}
  </div>
);

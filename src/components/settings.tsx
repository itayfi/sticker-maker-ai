import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { SettingsIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { useRef } from "react";

export const Settings = () => {
  const openAiApiKeyRef = useRef<HTMLInputElement>(null);

  const darkMode =
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const onToggleDarkTheme = (checked: boolean) => {
    localStorage.theme = checked ? "dark" : "light";
    document.documentElement.classList.toggle("dark", checked);
  };

  const onSave = () => {
    const value = openAiApiKeyRef.current?.value;
    if (value && value !== "") {
      localStorage.setItem("openai-api-key", value);
    } else {
      localStorage.removeItem("openai-api-key");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Settings</DialogHeader>
        <div className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              placeholder="OpenAI API Key"
              ref={openAiApiKeyRef}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              defaultChecked={darkMode}
              onCheckedChange={onToggleDarkTheme}
            />
            <Label htmlFor="dark-mode">Dark Theme</Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onSave}>Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

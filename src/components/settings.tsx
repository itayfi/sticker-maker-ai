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
import { useLocalStorage } from "@uidotdev/usehooks";

export const Settings = () => {
  const openAiApiKeyRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useLocalStorage("openai-api-key", "");
  const [darkMode, setDarkMode] = useLocalStorage(
    "theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  const onToggleDarkTheme = (checked: boolean) => {
    setDarkMode(checked ? "dark" : "light");
    document.documentElement.classList.toggle("dark", checked);
  };

  const onSave = () => {
    const value = openAiApiKeyRef.current?.value;
    setApiKey(value ?? "");
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
              defaultValue={apiKey}
              ref={openAiApiKeyRef}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={darkMode === "dark"}
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

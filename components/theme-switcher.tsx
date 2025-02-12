"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckIcon, MoonIcon, SunIcon } from "lucide-react";
import { DesktopIcon } from "@radix-ui/react-icons";

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {theme === "light" && <SunIcon />}
        {theme === "dark" && <MoonIcon />}
        {theme === "system" && <DesktopIcon />}
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            onClick={() => {
              setTheme("light");
            }}
          >
            <SunIcon />
            Light
            {theme === "light" && <CheckIcon />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTheme("dark");
            }}
          >
            <MoonIcon />
            Dark
            {theme === "dark" && <CheckIcon />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setTheme("system");
            }}
          >
            <DesktopIcon />
            System
            {theme === "system" && <CheckIcon />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export default ThemeSwitcher;

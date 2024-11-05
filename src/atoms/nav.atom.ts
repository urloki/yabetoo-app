import { atomWithStorage } from "jotai/utils";
import type { LucideIcon } from "lucide-react";
import { atom, useAtom } from "jotai";

interface ShortcutInterface {
  label: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
  isPinned: boolean;
}

export const shortcutsAtom = atomWithStorage<Array<ShortcutInterface>>(
  "shortcuts",
  [
    {
      label: "paymentLinks",
      path: "/payment-links",
      isPinned: true,
    },
  ],
);

export const useShortcutsAtom = () => {
  const [shortcuts, setShortcuts] = useAtom(shortcutsAtom);

  const addShortcut = (shortcut: ShortcutInterface) => {
    // Check if the shortcut already exists
    if (shortcuts.some((s) => s.path === shortcut.path)) {
      return;
    }
    // if length is less than 5, add the shortcut else remove the first if is not pinned
    if (shortcuts.length < 5) {
      setShortcuts([...shortcuts, shortcut]);
    } else {
      const firstUnpinnedShortcut = shortcuts.find((s) => !s.isPinned);
      if (firstUnpinnedShortcut) {
        removeShortcut(firstUnpinnedShortcut);
        setShortcuts([...shortcuts, shortcut]);
      }
    }
  };

  const removeShortcut = (shortcut: ShortcutInterface) => {
    setShortcuts((shortcuts: Array<ShortcutInterface>) =>
      shortcuts.filter((s) => s.path !== shortcut.path),
    );
  };

  const togglePin = (shortcut: ShortcutInterface) => {
    setShortcuts((shortcuts: Array<ShortcutInterface>) =>
      shortcuts.map((s) =>
        s.path === shortcut.path ? { ...s, isPinned: !s.isPinned } : s,
      ),
    );
  };

  return {
    shortcuts,
    addShortcut,
    removeShortcut,
    togglePin,
  };
};

const navMobileSidebarAtom = atom(false);

export const useNavMobileSidebarAtom = () => {
  const [isOpen, setIsOpen] = useAtom(navMobileSidebarAtom);

  const toggleNavMobileSidebar = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    toggleNavMobileSidebar,
  };
};

"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  //useAutoLogout();
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" {...props}>
      {children}
    </NextThemesProvider>
  );
}

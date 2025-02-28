import type { Metadata } from "next";
import "./globals.css";
import { Locale } from "@/app.config";
import React from "react";
import { getMessages } from "next-intl/server";
import { auth } from "@/auth";
import { NextIntlClientProvider } from "next-intl";
import ReactQueryProviders from "@/src/providers/react-query-provider";
import { AuthProvider } from "@/src/providers/next-auth-provider";
import { AutoLogoutProvider } from "@/src/providers/auto-logout-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import JotaiProvider from "@/src/providers/jotai-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Yabetoo",
  description: "La plateforme de paiement pour les entreprises",
};

type Props = {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
};

const RootLayout: React.FC<Props> = async ({ children, params }) => {
  const session = await auth();

  const messages = await getMessages();

  const { locale } = await params;
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      translate="no"
      className="notranslate"
    >
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-svh antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProviders>
            <AuthProvider session={session}>
              <AutoLogoutProvider>
                <JotaiProvider>
                  <ThemeProvider defaultTheme="dark">
                    {children}
                    <Toaster
                      richColors
                      position="top-right"
                      expand
                      closeButton
                    />
                  </ThemeProvider>
                </JotaiProvider>
              </AutoLogoutProvider>
            </AuthProvider>
          </ReactQueryProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};
export default RootLayout;

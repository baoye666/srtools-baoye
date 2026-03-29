import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { ClientThemeWrapper, ThemeProvider } from "@/components/themeController";
import Footer from "@/components/footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ToastContainer } from 'react-toastify';
import QueryProviderWrapper from "@/components/queryProvider";
import ClientDataFetcher from "@/components/clientDataFetcher";
import AvatarBar from "@/components/avatarBar";
import ActionBar from "@/components/actionBar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Firefly SrTools",
  description: "SrTools by Firefly Shelter",
  icons: {
    icon: "/ff-srtool.png",
    shortcut: "/ff-srtool.ico",
    apple: "/ff-srtool.png",
  },
  openGraph: {
    title: "Firefly SrTools",
    description: "SrTools by Firefly Shelter",
    url: "https://srtools.punklorde.org",
    siteName: "Firefly SrTools",
    images: [
      {
        url: "https://srtools.punklorde.org/ff-srtool.png",
        width: 312,
        height: 312,
        alt: "Firefly SrTools Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Firefly SrTools",
    description: "SrTools by Firefly Shelter",
    images: ["https://srtools.punklorde.org/ff-srtool.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProviderWrapper>
            <ThemeProvider>
              <ClientThemeWrapper>
                <ClientDataFetcher >
                  <div className="min-h-screen w-full">
                    <Header />
                    <div className="grid grid-cols-12 w-full">
                      <div className="hidden sm:block md:col-span-4 lg:col-span-3 sticky top-0 self-start h-fit">
                        <AvatarBar />
                      </div>
                      <div className="col-span-12 sm:col-span-8 lg:col-span-9">
                        <ActionBar />
                        {children}
                      </div>
                    </div>

                    <Footer />
                  </div>
                </ClientDataFetcher>
              </ClientThemeWrapper>
            </ThemeProvider>
          </QueryProviderWrapper>
        </NextIntlClientProvider>
        <ToastContainer />

      </body>

    </html>
  );
}

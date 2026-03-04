import type { Metadata } from "next";
import "./globals.css";
import { geistSans } from "./fonts";
import { Toaster } from "sonner";




export const metadata: Metadata = {
  title: {
    default: "234Grammar – Built for Nigerian English",
    template: "%s | 234Grammar",
  },
  description:
    "A grammar and style checker built for Nigerian and African English. Pay in Naira. 100% private. Runs in your browser.",
  keywords: [
    "Nigerian grammar checker",
    "African English",
    "Pidgin grammar",
    "Grammar tool Nigeria",
    "SaaS Africa",
  ],
  metadataBase: new URL("https://234grammar.com"), // change when live
  openGraph: {
    title: "234Grammar – Built for African English",
    description:
      "Finally, a grammar checker that understands Nigerian and African English.",
    url: "https://234grammar.com",
    siteName: "234Grammar",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "234Grammar – Built for Nigerian English" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "234Grammar – Built for African English",
    description:
      "A grammar checker designed for Nigerian & African writers.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-50">
      <body
        className={`${geistSans.variable} antialiased min-h-screen text-slate-900`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

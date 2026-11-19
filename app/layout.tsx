import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AdminProvider } from "@/components/AdminProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { UserMenu } from "@/components/UserMenu";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Scotiabank Pre-Patent Screening",
  description:
    "Confidential invention disclosure and automated pre-patent screening for Scotiabank employees.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <LanguageProvider>
          <AdminProvider>
            {children}
            <UserMenu />
          </AdminProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

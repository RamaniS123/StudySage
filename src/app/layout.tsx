import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "../../providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Goat Notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

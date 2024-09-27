import localFont from "next/font/local";
import "./globals.css";

const montSerrat = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});
const montSerratItalic = localFont({
  src: "./fonts/Montserrat-Italic-VariableFont_wght.ttf",
  variable: "--font-montserrat-italic",
  weight: "100 900",
});

export const metadata = {
  title: "KoinX",
  description: "KoinX Mainpage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montSerrat.variable} ${montSerratItalic.variable}`}>
        {children}
      </body>
    </html>
  );
}

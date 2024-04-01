import { Inter } from "next/font/google";
import "./ui/globals.css";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Health App Admin Dashboard",
  description: "Health App Admin Dashboard",
};

export default function RootLayout({ children }) {
  //   redirect("/dashboard");
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

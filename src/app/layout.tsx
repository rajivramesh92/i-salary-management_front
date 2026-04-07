import "./globals.css";
import Link from "next/link";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Salary Management Tool",
  description: "HR salary management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-50 text-gray-900">
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Salary Manager
            </Link>

            <div className="flex gap-6 text-sm font-medium">
              <Link href="/employees" className="hover:text-blue-600">
                Employees
              </Link>
              <Link href="/insights" className="hover:text-blue-600">
                Insights
              </Link>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Salary Management Tool",
  description: "Employee management and salary insights dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <div className="min-h-screen">
          <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <Link href="/" className="text-2xl font-bold tracking-tight">
                  Salary Manager
                </Link>
                <p className="text-sm text-slate-500">
                  Employee records & compensation insights
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/employees"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Employees
                </Link>
                <Link
                  href="/insights"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Insights
                </Link>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
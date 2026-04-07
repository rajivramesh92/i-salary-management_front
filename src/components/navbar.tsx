import Link from "next/link";

export default function Navbar() {
  return (
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
  );
}
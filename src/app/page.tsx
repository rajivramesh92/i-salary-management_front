import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Salary Management Tool</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">
        A minimal HR dashboard to manage employees and view salary insights by
        country and job title.
      </p>

      <div className="flex gap-4">
        <Link
          href="/employees"
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          Manage Employees
        </Link>

        <Link
          href="/insights"
          className="border px-5 py-3 rounded-xl"
        >
          View Insights
        </Link>
      </div>
    </main>
  );
}
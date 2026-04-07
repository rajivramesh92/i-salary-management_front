import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-8 md:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-blue-600 mb-3">
            Salary Management Assessment
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Manage employee data and explore salary insights with clarity.
          </h1>
          <p className="text-slate-600 text-lg mt-5 leading-8">
            A clean dashboard to manage employee records, analyze salary trends,
            and explore compensation data across countries, departments, and job titles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/employees"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition text-center"
            >
              Manage Employees
            </Link>

            <Link
              href="/insights"
              className="border border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-2xl font-medium transition text-center"
            >
              View Insights
            </Link>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          title="Employee CRUD"
          description="Create, update, view, and manage employee records with validation."
        />
        <FeatureCard
          title="Filtering & Search"
          description="Quickly find employees by name, country, or job title."
        />
        <FeatureCard
          title="Analytics Dashboard"
          description="Explore salary patterns with metrics, tables, and charts."
        />
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-slate-600 mt-2 leading-7">{description}</p>
    </div>
  );
}
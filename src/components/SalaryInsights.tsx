export default function SalaryInsights({ data }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card title="Employee Count" value={data.employee_count} />
        <Card title="Min Salary" value={`$${data.min_salary}`} />
        <Card title="Max Salary" value={`$${data.max_salary}`} />
        <Card title="Average Salary" value={`$${data.avg_salary}`} />
        <Card title="Median Salary" value={`$${data.median_salary}`} />
        <Card title="Total Payroll" value={`$${data.total_payroll}`} />
        <Card title="Avg Salary for Job Title" value={`$${data.avg_salary_for_job_title}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-2xl p-5 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top 5 Highest Paid Employees</h2>
          <ul className="space-y-3">
            {data.top_5_highest_paid?.map((emp) => (
              <li key={emp.id} className="flex justify-between border-b pb-2">
                <span>{emp.full_name} — {emp.job_title}</span>
                <span>${emp.salary}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded-2xl p-5 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Salary Distribution</h2>
          <ul className="space-y-3 text-gray-700">
            <li>Below 50k: {data.salary_distribution?.below_50k}</li>
            <li>50k - 100k: {data.salary_distribution?.between_50k_100k}</li>
            <li>100k - 150k: {data.salary_distribution?.between_100k_150k}</li>
            <li>Above 150k: {data.salary_distribution?.above_150k}</li>
          </ul>
        </div>
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value ?? "-"}</p>
    </div>
  );
}
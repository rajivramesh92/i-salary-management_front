"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SalaryInsightsProps = {
  data: {
    total_employees: number;
    total_countries: number;
    total_job_titles: number;
    overall_average_salary: number;
    highest_salary: string;
    lowest_salary: string;
    employee_count_by_country: Record<string, number>;
    employee_count_by_department: Record<string, number>;
    average_salary_by_department: Record<string, number>;
    top_5_highest_paying_job_titles: Record<string, number>;
  };
};

export default function SalaryInsights({ data }: SalaryInsightsProps) {
  const countryChartData = Object.entries(data.employee_count_by_country)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }));

  const departmentSalaryChartData = Object.entries(data.average_salary_by_department)
    .sort((a, b) => b[1] - a[1])
    .map(([department, salary]) => ({
      department,
      salary: Number(salary),
    }));

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <MetricCard title="Total Employees" value={data.total_employees} />
        <MetricCard title="Countries" value={data.total_countries} />
        <MetricCard title="Job Titles" value={data.total_job_titles} />
        <MetricCard title="Avg Salary" value={`$${Number(data.overall_average_salary).toFixed(2)}`} />
        <MetricCard title="Highest Salary" value={`$${Number(data.highest_salary).toLocaleString()}`} />
        <MetricCard title="Lowest Salary" value={`$${Number(data.lowest_salary).toLocaleString()}`} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <ChartCard title="Employee Distribution by Country">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={countryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Salary by Department">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={departmentSalaryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salary" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      <Section title="Employee Count by Country">
        <DataTable
          headers={["Country", "Employees"]}
          rows={Object.entries(data.employee_count_by_country)
            .sort((a, b) => b[1] - a[1])
            .map(([country, count]) => [country, count])}
        />
      </Section>

      <Section title="Employee Count by Department">
        <DataTable
          headers={["Department", "Employees"]}
          rows={Object.entries(data.employee_count_by_department)
            .sort((a, b) => b[1] - a[1])
            .map(([department, count]) => [department, count])}
        />
      </Section>

      <Section title="Average Salary by Department">
        <DataTable
          headers={["Department", "Average Salary"]}
          rows={Object.entries(data.average_salary_by_department)
            .sort((a, b) => b[1] - a[1])
            .map(([department, salary]) => [
              department,
              `$${Number(salary).toFixed(2)}`,
            ])}
        />
      </Section>

      <Section title="Top 5 Highest Paying Job Titles">
        <DataTable
          headers={["Job Title", "Average Salary"]}
          rows={Object.entries(data.top_5_highest_paying_job_titles)
            .sort((a, b) => b[1] - a[1])
            .map(([jobTitle, salary]) => [
              jobTitle,
              `$${Number(salary).toFixed(2)}`,
            ])}
        />
      </Section>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold mt-3 tracking-tight">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 tracking-tight">{title}</h2>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {children}
      </div>
    </section>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="w-full text-left">
      <thead className="border-b border-slate-200 bg-slate-50">
        <tr>
          {headers.map((header) => (
            <th key={header} className="p-4 text-sm font-semibold text-slate-700">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className="border-b border-slate-100 last:border-none">
            {row.map((cell, i) => (
              <td key={i} className="p-4 text-sm text-slate-800">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
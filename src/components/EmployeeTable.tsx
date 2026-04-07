"use client";

import Link from "next/link";

type Employee = {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department?: string;
};

type Props = {
  employees: Employee[];
  onDelete: (id: number) => void;
};

export default function EmployeeTable({ employees, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-sm text-slate-600">
            <th className="p-5 font-semibold">Employee</th>
            <th className="p-5 font-semibold">Job Title</th>
            <th className="p-5 font-semibold">Country</th>
            <th className="p-5 font-semibold">Salary</th>
            <th className="p-5 font-semibold">Department</th>
            <th className="p-5 font-semibold text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-slate-100 hover:bg-slate-50/70 transition"
              >
                <td className="p-5">
                  <div>
                    <p className="font-semibold text-slate-900">{employee.full_name}</p>
                    <p className="text-sm text-slate-500">Employee ID: {employee.id}</p>
                  </div>
                </td>

                <td className="p-5 text-slate-700">{employee.job_title}</td>
                <td className="p-5 text-slate-700">{employee.country}</td>
                <td className="p-5 font-medium text-slate-900">
                  ${Number(employee.salary).toLocaleString()}
                </td>
                <td className="p-5 text-slate-700">{employee.department || "-"}</td>

                <td className="p-5">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/employees/${employee.id}/edit`}
                      className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm font-medium transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-14 text-center">
                <div className="max-w-md mx-auto">
                  <p className="text-xl font-semibold text-slate-800">
                    No employees found
                  </p>
                  <p className="text-slate-500 mt-2 leading-7">
                    Try adjusting your filters or create a new employee record.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
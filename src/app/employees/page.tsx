"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Filters from "@/components/filter";
import EmployeeTable from "@/components/EmployeeTable";

type Employee = {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department?: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/employees", {
        params: {
          search,
          country,
          job_title: jobTitle,
          sort: "created_at",
          direction: "desc",
        },
      });

      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;

    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-gray-500 mt-1">Manage employee records</p>
        </div>

        <Link
          href="/employees/new"
          className="bg-black text-white px-4 py-3 rounded-xl"
        >
          Add Employee
        </Link>
      </div>

      <Filters
        search={search}
        setSearch={setSearch}
        country={country}
        setCountry={setCountry}
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        onApply={fetchEmployees}
      />

      {loading ? (
        <p className="text-gray-500">Loading employees...</p>
      ) : (
        <EmployeeTable employees={employees} onDelete={handleDelete} />
      )}
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Filters from "@/components/Filters";
import EmployeeTable from "@/components/EmployeeTable";

type Employee = {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department?: string;
  email?: string;
  employment_type?: string;
  date_of_joining?: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/employees", {
        params: {
          search: debouncedSearch,
          country: country === "all" ? "" : country,
          job_title: jobTitle,
          sort: "created_at",
          direction: "desc",
        },
      });

      setEmployees(response.data.employees || response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Delete this employee permanently?");
    if (!confirmed) return;

    try {
      await api.delete(`/employees/${id}`);
      await fetchEmployees();
      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete employee");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, country, jobTitle]);

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const paginatedEmployees = useMemo(() => {
    return employees.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [employees, currentPage]);

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-2">
              Employee Management
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Manage Employees
            </h1>
            <p className="text-slate-600 mt-3 max-w-2xl leading-7">
              Search, filter, and manage employee records from a single place.
            </p>
          </div>

          <Link
            href="/employees/new"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-2xl text-center font-medium shadow-sm"
          >
            + Add Employee
          </Link>
        </div>

        <div className="mt-8">
          <Filters
            search={search}
            setSearch={setSearch}
            country={country}
            setCountry={setCountry}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-lg">
            Fetching employees...
          </div>
        ) : (
          <>
            <EmployeeTable employees={paginatedEmployees} onDelete={handleDelete} />

            {employees.length > itemsPerPage && (
              <div className="flex justify-between items-center px-6 py-5 border-t border-slate-200 bg-slate-50">
                <p className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, employees.length)} of{" "}
                  {employees.length}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-slate-300 rounded-xl disabled:opacity-50 hover:bg-white transition"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-slate-300 rounded-xl disabled:opacity-50 hover:bg-white transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <p className="text-xs text-slate-400 text-center">
        Built with focus on clean architecture, maintainability, and usability.
      </p>
    </main>
  );
}
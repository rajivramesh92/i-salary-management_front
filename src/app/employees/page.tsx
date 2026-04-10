"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import Filters from "@/components/Filters";
import EmployeeTable from "@/components/EmployeeTable";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchEmployees = async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await api.get("/employees", {
        params: {
          search: debouncedSearch,
          country: country === "all" ? "" : country,
          job_title: jobTitle,
          sort: "created_at",
          direction: "desc",
        },
        timeout: 60000,   // Increased to 60 seconds
      });

      setEmployees(
        response.data.data ||
        response.data.employees ||
        response.data ||
        []
      );
      setCurrentPage(1);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch employees", err);
      if (!isRetry) {
        if (err.code === 'ECONNABORTED') {
          setError("Request timed out. Backend is slow or sleeping.");
        } else {
          setError("Unable to load employees. Please check if backend is running.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, country, jobTitle]);

  const handleRetry = () => {
    fetchEmployees(true);
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
        {loading && (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-600">Fetching employees...</p>
            <p className="text-sm text-slate-400 mt-2">
              (Backend may take 10-40 seconds to wake up on free tier)
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="p-20 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-3xl">⚠️</span>
            </div>
            <p className="text-red-700 font-medium mb-2">{error}</p>
            <p className="text-slate-500 text-sm mb-6">
              Backend is slow or sleeping. Please be patient.
            </p>
            <Button 
              onClick={handleRetry}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Now
            </Button>
          </div>
        )}

        {!loading && !error && (
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
    </main>
  );
}



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import api from "@/services/api";
// import Filters from "@/components/Filters";
// import EmployeeTable from "@/components/EmployeeTable";
// import { Button } from "@/components/ui/button";
// import { Loader2, RefreshCw } from "lucide-react";

// type Employee = {
//   id: number;
//   full_name: string;
//   job_title: string;
//   country: string;
//   salary: number;
//   department?: string;
//   email?: string;
//   employment_type?: string;
//   date_of_joining?: string;
// };

// export default function EmployeesPage() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [search, setSearch] = useState("");
//   const [country, setCountry] = useState("all");
//   const [jobTitle, setJobTitle] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [debouncedSearch, setDebouncedSearch] = useState(search);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchEmployees = async (isRetry = false) => {
//     if (!isRetry) {
//       setLoading(true);
//       setError(null);
//     }

//     try {
//       const response = await api.get("/employees", {
//         params: {
//           search: debouncedSearch,
//           country: country === "all" ? "" : country,
//           job_title: jobTitle,
//           sort: "created_at",
//           direction: "desc",
//         },
//       });

//       setEmployees(
//         response.data.data ||
//         response.data.employees ||
//         response.data ||
//         []
//       );
//       setCurrentPage(1);
//       setError(null);
//     } catch (err: any) {
//       console.error("Failed to fetch employees", err);
//       if (!isRetry) {
//         setError("Unable to load employees. Please check backend API.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, [debouncedSearch, country, jobTitle]);

//   const handleRetry = () => {
//     fetchEmployees(true);
//   };

//   const handleDelete = async (id: number) => {
//     const confirmed = confirm("Delete this employee permanently?");
//     if (!confirmed) return;

//     try {
//       await api.delete(`/employees/${id}`);
//       await fetchEmployees();
//       alert("Employee deleted successfully");
//     } catch (error) {
//       console.error("Delete failed", error);
//       alert("Failed to delete employee");
//     }
//   };

//   const totalPages = Math.ceil(employees.length / itemsPerPage);

//   const paginatedEmployees = useMemo(() => {
//     return employees.slice(
//       (currentPage - 1) * itemsPerPage,
//       currentPage * itemsPerPage
//     );
//   }, [employees, currentPage]);

//   return (
//     <main className="space-y-8">
//       <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
//         <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//           <div>
//             <p className="text-sm font-medium text-blue-600 mb-2">
//               Employee Management
//             </p>
//             <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//               Manage Employees
//             </h1>
//             <p className="text-slate-600 mt-3 max-w-2xl leading-7">
//               Search, filter, and manage employee records from a single place.
//             </p>
//           </div>
//           <Link
//             href="/employees/new"
//             className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-2xl text-center font-medium shadow-sm"
//           >
//             + Add Employee
//           </Link>
//         </div>

//         <div className="mt-8">
//           <Filters
//             search={search}
//             setSearch={setSearch}
//             country={country}
//             setCountry={setCountry}
//             jobTitle={jobTitle}
//             setJobTitle={setJobTitle}
//           />
//         </div>
//       </section>

//       <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//         {loading && (
//           <div className="p-20 flex flex-col items-center justify-center">
//             <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
//             <p className="text-slate-600">Fetching employees...</p>
//             <p className="text-sm text-slate-400 mt-1">
//               (Backend may take 10-30 seconds to wake up)
//             </p>
//           </div>
//         )}

//         {error && !loading && (
//           <div className="p-20 text-center">
//             <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//               <span className="text-red-600 text-3xl">⚠️</span>
//             </div>
//             <p className="text-red-700 font-medium mb-2">{error}</p>
//             <p className="text-slate-500 text-sm mb-6">
//               The backend might be sleeping. Click retry below.
//             </p>
//             <Button 
//               onClick={handleRetry}
//               className="gap-2 bg-blue-600 hover:bg-blue-700"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Retry Now
//             </Button>
//           </div>
//         )}

//         {!loading && !error && (
//           <>
//             <EmployeeTable employees={paginatedEmployees} onDelete={handleDelete} />
            
//             {employees.length > itemsPerPage && (
//               <div className="flex justify-between items-center px-6 py-5 border-t border-slate-200 bg-slate-50">
//                 <p className="text-sm text-slate-500">
//                   Showing {(currentPage - 1) * itemsPerPage + 1}– 
//                   {Math.min(currentPage * itemsPerPage, employees.length)} of{" "}
//                   {employees.length}
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 border border-slate-300 rounded-xl disabled:opacity-50 hover:bg-white transition"
//                   >
//                     Previous
//                   </button>
//                   <span className="text-sm font-medium text-slate-600">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 border border-slate-300 rounded-xl disabled:opacity-50 hover:bg-white transition"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </section>

//       <p className="text-xs text-slate-400 text-center">
//         Built with focus on clean architecture, maintainability, and usability.
//       </p>
//     </main>
//   );
// }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import api from "@/services/api";
// import Filters from "@/components/Filters";
// import EmployeeTable from "@/components/EmployeeTable";
// import { Button } from "@/components/ui/button";
// import { Loader2, RefreshCw } from "lucide-react";

// type Employee = {
//   id: number;
//   full_name: string;
//   job_title: string;
//   country: string;
//   salary: number;
//   department?: string;
//   email?: string;
//   employment_type?: string;
//   date_of_joining?: string;
// };

// export default function EmployeesPage() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [search, setSearch] = useState("");
//   const [country, setCountry] = useState("all");
//   const [jobTitle, setJobTitle] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [debouncedSearch, setDebouncedSearch] = useState(search);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchEmployees = async (isRetry = false) => {
//     if (!isRetry) {
//       setLoading(true);
//       setError(null);
//     }

//     try {
//       const response = await api.get("/employees", {
//         params: {
//           search: debouncedSearch,
//           country: country === "all" ? "" : country,
//           job_title: jobTitle,
//           sort: "created_at",
//           direction: "desc",
//         },
//       });
      
//       console.log("API RESPONSE:", response.data);

//       setEmployees(
//         response.data.data ||
//         response.data.employees ||
//         response.data ||
//         []
//       );
//       setCurrentPage(1);
//       setError(null);
//     } catch (err: any) {
//       console.error("Failed to fetch employees", err);
//       if (!isRetry) {
//         setError("Unable to load employees. Please check backend API.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchEmployees();
//   }, [debouncedSearch, country, jobTitle]);

//   const handleRetry = () => {
//     fetchEmployees(true);
//   };

//   const handleDelete = async (id: number) => {
//     const confirmed = confirm("Delete this employee permanently?");
//     if (!confirmed) return;

//     try {
//       await api.delete(`/employees/${id}`);
//       await fetchEmployees();
//       alert("Employee deleted successfully");
//     } catch (error) {
//       console.error("Delete failed", error);
//       alert("Failed to delete employee");
//     }
//   };

//   const totalPages = Math.ceil(employees.length / itemsPerPage);

//   const paginatedEmployees = useMemo(() => {
//     return employees.slice(
//       (currentPage - 1) * itemsPerPage,
//       currentPage * itemsPerPage
//     );
//   }, [employees, currentPage]);

//   return (
//     <main className="space-y-8">
//       <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
//         <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//           <div>
//             <p className="text-sm font-medium text-blue-600 mb-2">
//               Employee Management
//             </p>
//             <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//               Manage Employees
//             </h1>
//             <p className="text-slate-600 mt-3 max-w-2xl leading-7">
//               Search, filter, and manage employee records from a single place.
//             </p>
//           </div>
//           <Link
//             href="/employees/new"
//             className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-2xl text-center font-medium shadow-sm"
//           >
//             + Add Employee
//           </Link>
//         </div>

//         <div className="mt-8">
//           <Filters
//             search={search}
//             setSearch={setSearch}
//             country={country}
//             setCountry={setCountry}
//             jobTitle={jobTitle}
//             setJobTitle={setJobTitle}
//           />
//         </div>
//       </section>

//       <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//         {/* Loading State */}
//         {loading && (
//           <div className="p-20 flex flex-col items-center justify-center">
//             <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
//             <p className="text-slate-600">Fetching employees...</p>
//             <p className="text-sm text-slate-400 mt-1">
//               (Backend may take 10-30 seconds to wake up)
//             </p>
//           </div>
//         )}

//         {/* Error State with Retry Button */}
//         {error && !loading && (
//           <div className="p-20 text-center">
//             <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//               <span className="text-red-600 text-3xl">⚠️</span>
//             </div>
//             <p className="text-red-700 font-medium mb-2">{error}</p>
//             <p className="text-slate-500 text-sm mb-6">
//               The backend might be sleeping. Click retry below.
//             </p>
//             <Button 
//               onClick={handleRetry}
//               className="gap-2 bg-blue-600 hover:bg-blue-700"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Retry Now
//             </Button>
//           </div>
//         )}

//         {/* Main Content */}
//         {!loading && !error && (
//           <>
//             <EmployeeTable employees={paginatedEmployees} onDelete={handleDelete} />
            
//             {employees.length > itemsPerPage && (
//               <div className="flex justify-between items-center px-6 py-5 border-t border-slate-200 bg-slate-50">
//                 <p className="text-sm text-slate-500">
//                   Showing {(currentPage - 1) * itemsPerPage + 1}– 
//                   {Math.min(currentPage * itemsPerPage, employees.length)} of{" "}
//                   {employees.length}
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 border border-slate-300 rounded-xl disabled:opacity-50 hover:bg-white transition"
//                   >
//                     Previous
//                   </button>
//                   <span className="text-sm font-medium text-slate-600">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 border border-slate-300 rounded-xl disabled:opacity-50 hover:bg-white transition"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </section>

//       <p className="text-xs text-slate-400 text-center">
//         Built with focus on clean architecture, maintainability, and usability.
//       </p>
//     </main>
//   );
// }



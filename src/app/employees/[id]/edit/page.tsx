"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import EmployeeForm from "@/components/EmployeeForm";

type Employee = {
  id?: number;
  full_name: string;
  job_title: string;
  country: string;
  salary:  number;
  department: string;
  email: string;    
  employment_type: string;
  date_of_joining: string;
};

export default function EditEmployeePage() {
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${params.id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error("Failed to load employee", error);
      }
    };

    fetchEmployee();
  }, [params.id]);

  if (!employee) {
    return <main className="max-w-7xl mx-auto px-6 py-10">Loading...</main>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Employee</h1>
      <EmployeeForm employee={employee} />
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

const initialState = {
  full_name: "",
  job_title: "",
  country: "",
  salary: "",
  department: "",
  email: "",
  employment_type: "",
  date_of_joining: "",
};

export default function EmployeeForm({ employee = null }) {
  const router = useRouter();
  const [form, setForm] = useState(employee || initialState);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const payload = {
        employee: {
          ...form,
          salary: Number(form.salary),
        },
      };

      if (employee?.id) {
        await api.put(`/employees/${employee.id}`, payload);
      } else {
        await api.post("/employees", payload);
      }

      router.push("/employees");
    } catch (error) {
      setErrors(error?.response?.data?.errors || ["Something went wrong"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          {errors.map((err, idx) => (
            <p key={idx} className="text-red-600 text-sm">{err}</p>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.full_name} onChange={(v) => handleChange("full_name", v)} />
        <Input label="Job Title" value={form.job_title} onChange={(v) => handleChange("job_title", v)} />
        <Input label="Country" value={form.country} onChange={(v) => handleChange("country", v)} />
        <Input label="Salary" type="number" value={form.salary} onChange={(v) => handleChange("salary", v)} />
        <Input label="Department" value={form.department} onChange={(v) => handleChange("department", v)} />
        <Input label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
        <Input label="Employment Type" value={form.employment_type} onChange={(v) => handleChange("employment_type", v)} />
        <Input label="Date of Joining" type="date" value={form.date_of_joining} onChange={(v) => handleChange("date_of_joining", v)} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-5 py-3 rounded-xl"
      >
        {loading ? "Saving..." : employee?.id ? "Update Employee" : "Create Employee"}
      </button>
    </form>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <input
        type={type}
        className="w-full border rounded-xl p-3"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
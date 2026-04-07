"use client";

import { useState } from "react";
import api from "@/services/api";
import SalaryInsights from "@/components/SalaryInsights";

export default function InsightsPage() {
  const [country, setCountry] = useState("India");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await api.get("/salary_insights", {
        params: { country, job_title: jobTitle },
      });
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch insights", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Salary Insights</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <input
          className="border rounded-xl p-3"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <input
          className="border rounded-xl p-3"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <button
          onClick={fetchInsights}
          className="bg-black text-white rounded-xl px-4 py-3"
        >
          {loading ? "Loading..." : "Get Insights"}
        </button>
      </div>

      {data && <SalaryInsights data={data} />}
    </main>
  );
}
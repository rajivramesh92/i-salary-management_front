"use client";

import { useState } from "react";
import api from "@/services/api";
import SalaryInsights from "@/components/SalaryInsights";

type InsightsResponse = {
  employee_count: number;
  min_salary: number;
  max_salary: number;
  avg_salary: number;
  median_salary: number;
  total_payroll: number;
  avg_salary_for_job_title: number;
  top_5_highest_paid?: {
    id: number;
    full_name: string;
    job_title: string;
    salary: number;
  }[];
  salary_distribution?: {
    below_50k: number;
    between_50k_100k: number;
    between_100k_150k: number;
    above_150k: number;
  };
};

export default function InsightsPage() {
  const [country, setCountry] = useState("India");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/salary_insights", {
        params: {
          country,
          job_title: jobTitle,
        },
      });

      setData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch insights", err);
      setError(
        err?.response?.data?.error ||
          "Unable to load salary insights. Please check backend API."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Salary Insights</h1>
        <p className="text-gray-500 mt-2">
          Analyze salary data by country and job title.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          className="border rounded-xl p-3 bg-white"
          placeholder="Country (e.g. India)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <input
          className="border rounded-xl p-3 bg-white"
          placeholder="Job Title (e.g. Software Engineer)"
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

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          Enter a country and job title, then click <strong>Get Insights</strong>.
        </div>
      )}

      {data && <SalaryInsights data={data} />}
    </main>
  );
}
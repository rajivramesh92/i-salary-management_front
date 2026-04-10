"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import SalaryInsights from "@/components/SalaryInsights";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

type InsightsResponse = {
  employee_count?: number;
  min_salary?: number;
  max_salary?: number;
  avg_salary?: number;
  median_salary?: number;
  total_payroll?: number;
  avg_salary_for_job_title?: number;
  total_employees?: number;
  total_countries?: number;
  total_job_titles?: number;
  overall_average_salary?: number;
  highest_salary?: number | string;
  lowest_salary?: number | string;
  employee_count_by_country?: Record<string, number>;
  employee_count_by_department?: Record<string, number>;
  average_salary_by_department?: Record<string, number>;
  top_5_highest_paying_job_titles?: Record<string, number>;
};

export default function InsightsPage() {
  const [country, setCountry] = useState("India");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (isRetry = false) => {
    if (!isRetry) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await api.get("/salary_insights", {
        params: {
          country,
          job_title: jobTitle,
        },
        timeout: 60000, 
      });

      setData(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch insights", err);
      setError(
        err?.response?.data?.error ||
          (err.code === "ECONNABORTED"
            ? "Request timed out. Backend is slow or sleeping."
            : "Unable to load salary insights. Please check backend API.")
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRetry = () => {
    fetchInsights(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <p className="text-sm font-medium text-blue-600 mb-2">
          Analytics & Reports
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Salary Insights</h1>
        <p className="text-slate-600 mt-3 max-w-2xl">
          Analyze salary trends, distributions, and key metrics by country and job title.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            className="border border-slate-300 rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500 transition"
            placeholder="Country (e.g. India)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            className="border border-slate-300 rounded-2xl px-4 py-3 bg-white focus:outline-none focus:border-blue-500 transition"
            placeholder="Job Title (e.g. Software Engineer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Button
            onClick={() => fetchInsights()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 h-[52px] text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              "Get Insights"
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-20 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
          <p className="text-slate-700 text-lg font-medium">Generating insights...</p>
          <p className="text-slate-500 mt-2">
            This may take 10–40 seconds (backend waking up)
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-3xl border border-red-200 bg-white p-20 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-red-600 text-4xl">⚠️</span>
          </div>
          <p className="text-red-700 font-semibold text-xl mb-2">Failed to load insights</p>
          <p className="text-slate-600 max-w-md mx-auto mb-8">{error}</p>
          <Button
            onClick={handleRetry}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Now
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!data && !loading && !error && (
        <div className="rounded-3xl border bg-white p-20 text-center text-slate-500">
          Enter country and job title above, then click <strong>Get Insights</strong>.
        </div>
      )}

      {/* Results */}
      {data && !loading && !error && <SalaryInsights data={data as any} />}
    </main>
  );
}
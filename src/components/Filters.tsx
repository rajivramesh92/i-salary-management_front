"use client";

type FiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  jobTitle: string;
  setJobTitle: (value: string) => void;
};

const countries = [
  "all",
  "India",
  "USA",
  "UK",
  "Germany",
  "Canada",
  "Australia",
  "France",
  "Netherlands",
  "Singapore",
  "UAE",
];

export default function Filters({
  search,
  setSearch,
  country,
  setCountry,
  jobTitle,
  setJobTitle,
}: FiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Search</label>
        <input
          className="w-full border border-slate-300 rounded-2xl p-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Search by employee name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Country</label>
        <select
          className="w-full border border-slate-300 rounded-2xl p-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All Countries" : item}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Job Title</label>
        <input
          className="w-full border border-slate-300 rounded-2xl p-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Filter by job title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>
    </div>
  );
}
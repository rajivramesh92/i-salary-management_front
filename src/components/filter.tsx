'use client';

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  jobTitle: string;
  setJobTitle: (value: string) => void;
  onApply: () => void;
}

export default function Filters({
  search, setSearch, country, setCountry, jobTitle, setJobTitle, onApply
}: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Countries</SelectItem>
          <SelectItem value="India">India</SelectItem>
          <SelectItem value="USA">USA</SelectItem>
          <SelectItem value="UK">UK</SelectItem>
          <SelectItem value="Germany">Germany</SelectItem>
        </SelectContent>
      </Select>

      <Select value={jobTitle} onValueChange={setJobTitle}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Job Titles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Job Titles</SelectItem>
          <SelectItem value="Software Engineer">Software Engineer</SelectItem>
          <SelectItem value="Product Manager">Product Manager</SelectItem>
          <SelectItem value="HR Manager">HR Manager</SelectItem>
          <SelectItem value="Data Analyst">Data Analyst</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={onApply}>Apply Filters</Button>
    </div>
  );
}
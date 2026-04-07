'use client';

import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type Employee = {
  id: number;
  full_name: string;        
  job_title: string;
  country: string;
  salary: number;
};

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (id: number) => void;
}

export default function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      onDelete(id);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Salary</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.full_name}</TableCell>
                <TableCell>{emp.job_title}</TableCell>
                <TableCell>{emp.country}</TableCell>
                <TableCell className="text-right">₹{emp.salary?.toLocaleString()}</TableCell>
                <TableCell className="text-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(emp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const employeeSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  job_title: z.string().min(2, "Job title is required"),
  country: z.string().min(2, "Country is required"),
  salary: z.number().min(10000, "Salary must be at least ₹10,000"),
  department: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  employment_type: z.string().optional(),
  date_of_joining: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: {
    id?: number;
    full_name?: string;
    job_title?: string;
    country?: string;
    salary?: number;
    department?: string;
    email?: string;
    employment_type?: string;
    date_of_joining?: string;
  };
}

const countries = [
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

const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern"];

export default function EmployeeForm({ employee }: EmployeeFormProps) {
  const router = useRouter();
  const isEdit = !!employee?.id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      full_name: employee?.full_name || "",
      job_title: employee?.job_title || "",
      country: employee?.country || "",
      salary: employee?.salary || 50000,
      department: employee?.department || "",
      email: employee?.email || "",
      employment_type: employee?.employment_type || "",
      date_of_joining: employee?.date_of_joining || "",
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const payload = {
        employee: {
          ...data,
          salary: Number(data.salary),
        },
      };

      if (isEdit && employee?.id) {
        await api.put(`/employees/${employee.id}`, payload);
      } else {
        await api.post("/employees", payload);
      }

      router.push("/employees");
    } catch (error) {
      console.error("Failed to save employee:", error);
      alert("Failed to save employee. Please try again.");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mt-10 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isEdit ? "Edit Employee" : "Add New Employee"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input {...register("full_name")} placeholder="John Doe" />
              {errors.full_name && (
                <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <Label>Job Title</Label>
              <Input {...register("job_title")} placeholder="Software Engineer" />
              {errors.job_title && (
                <p className="text-red-500 text-sm mt-1">{errors.job_title.message}</p>
              )}
            </div>

            <div>
              <Label>Country</Label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                {...register("salary", { valueAsNumber: true })}
                placeholder="50000"
              />
              {errors.salary && (
                <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
              )}
            </div>

            <div>
              <Label>Department</Label>
              <Input {...register("department")} placeholder="Engineering" />
            </div>

            <div>
              <Label>Email</Label>
              <Input {...register("email")} placeholder="john@example.com" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Employment Type</Label>
              <Controller
                control={control}
                name="employment_type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Date of Joining</Label>
              <Input type="date" {...register("date_of_joining")} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Employee"
                : "Create Employee"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/employees")}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}















// 'use client';

// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import api from '@/services/api';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useRouter } from 'next/navigation';

// const employeeSchema = z.object({
//   full_name: z.string().min(3, 'Full name must be at least 3 characters'),
//   job_title: z.string().min(2, 'Job title is required'),
//   country: z.string().min(2, 'Country is required'),
//   salary: z.number().min(10000, 'Salary must be at least ₹10,000'),
//   department: z.string().optional(),
//   hire_date: z.string().optional(),
// });

// type EmployeeFormData = z.infer<typeof employeeSchema>;

// interface EmployeeFormProps {
//   employee?: {
//     id?: number;
//     full_name?: string;
//     job_title?: string;
//     country?: string;
//     salary?: number;
//     department?: string;
//     hire_date?: string;
//   };
// }

// const countries = [
//   'India',
//   'USA',
//   'UK',
//   'Germany',
//   'Canada',
//   'Australia',
//   'France',
//   'Netherlands',
//   'Singapore',
//   'UAE',
// ];

// export default function EmployeeForm({ employee }: EmployeeFormProps) {
//   const router = useRouter();
//   const isEdit = !!employee?.id;

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isSubmitting },
//   } = useForm<EmployeeFormData>({
//     resolver: zodResolver(employeeSchema),
//     defaultValues: {
//       full_name: employee?.full_name || '',
//       job_title: employee?.job_title || '',
//       country: employee?.country || '',
//       salary: employee?.salary || 50000,
//       department: employee?.department || '',
//       hire_date: employee?.hire_date || '',
//     },
//   });

//   const onSubmit = async (data: EmployeeFormData) => {
//     try {
//       const payload = {
//         employee: data,
//       };

//       if (isEdit && employee?.id) {
//         await api.put(`/employees/${employee.id}`, payload);
//       } else {
//         await api.post('/employees', payload);
//       }

//       router.push('/employees');
//     } catch (error) {
//       console.error('Failed to save employee:', error);
//       alert('Failed to save employee. Please try again.');
//     }
//   };

//   return (
//     <Card className="max-w-3xl mx-auto mt-10 shadow-sm rounded-2xl">
//       <CardHeader>
//         <CardTitle className="text-2xl">
//           {isEdit ? 'Edit Employee' : 'Add New Employee'}
//         </CardTitle>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <Label>Full Name</Label>
//               <Input {...register('full_name')} placeholder="John Doe" />
//               {errors.full_name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
//               )}
//             </div>

//             <div>
//               <Label>Job Title</Label>
//               <Input {...register('job_title')} placeholder="Software Engineer" />
//               {errors.job_title && (
//                 <p className="text-red-500 text-sm mt-1">{errors.job_title.message}</p>
//               )}
//             </div>

//             <div>
//               <Label>Country</Label>
//               <Controller
//                 control={control}
//                 name="country"
//                 render={({ field }) => (
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select Country" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {countries.map((country) => (
//                         <SelectItem key={country} value={country}>
//                           {country}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//               {errors.country && (
//                 <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
//               )}
//             </div>

//             <div>
//               <Label>Salary (₹)</Label>
//               <Input
//                 type="number"
//                 {...register('salary', { valueAsNumber: true })}
//                 placeholder="50000"
//               />
//               {errors.salary && (
//                 <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
//               )}
//             </div>

//             <div>
//               <Label>Department</Label>
//               <Input {...register('department')} placeholder="Engineering" />
//             </div>

//             <div>
//               <Label>Hire Date</Label>
//               <Input type="date" {...register('hire_date')} />
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 pt-2">
//             <Button type="submit" disabled={isSubmitting} className="flex-1">
//               {isSubmitting
//                 ? 'Saving...'
//                 : isEdit
//                 ? 'Update Employee'
//                 : 'Create Employee'}
//             </Button>

//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.push('/employees')}
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
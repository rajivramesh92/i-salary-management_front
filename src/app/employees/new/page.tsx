import EmployeeForm from "@/components/EmployeeForm";

export default function NewEmployeePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Add Employee</h1>
      <EmployeeForm />
    </main>
  );
}
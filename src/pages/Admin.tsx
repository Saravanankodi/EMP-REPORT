// Admin.tsx
import { useState } from "react";
import FillterForm from "../components/forms/FillterForm"; // Note: typo in filename? Should be FilterForm?
import Header from "../components/layout/Header";
import Reports from "../components/layout/Reports";

interface FilterState {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

const Admin = () => {
  const [filters, setFilters] = useState<FilterState>({});

  const handleApplyFilters = () => {
    // This will trigger Reports to re-fetch with current filters
    setFilters({ ...filters });
  };

  return (
    <section className="w-full h-auto px-5 sm:px-10 grid gap-5">
      <Header Name="Saravana Kodi" />
      <FillterForm
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
      />
      <Reports filters={filters} />  {/* Pass filters down */}
    </section>
  );
};

export default Admin;
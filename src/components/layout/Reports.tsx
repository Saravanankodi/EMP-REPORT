// Reports.tsx
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  QueryConstraint
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import Banner from "../base/Banner";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";

interface FilterState {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
}

interface Report {
  id: string;
  userId: string;
  name: string;
  submittedAt: Timestamp;
  report: string;
  timeStart: string;
  timeEnd: string;
  status?: "pending" | "read";
}

interface EnrichedReport extends Report {
  userName: string;
}

const groupReportsByDate = <T extends { submittedAt: Timestamp }>(
  reports: T[]
): Record<string, T[]> => {
  return reports.reduce((acc, report) => {
    const dateKey = report.submittedAt.toDate().toLocaleDateString("en-GB");

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(report);
    return acc;
  }, {} as Record<string, T[]>);
};

interface ReportsProps {
  filters: FilterState;
}

function Reports({ filters }: ReportsProps) {
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [groupedReports, setGroupedReports] = useState<
    Record<string, EnrichedReport[]>
  >({});

  // Load users map
  useEffect(() => {
    const usersRef = collection(db, "users");
  
    const unsub = onSnapshot(usersRef, (snapshot) => {
      const map: Record<string, User> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Safely extract name — fallback to email if name missing
        const name = data.name || data.email || "Unknown User";
        const role = data.role || "user";
  
        map[doc.id] = {
          id: doc.id,
          name,
          role,
        };
      });
  
      console.log("Users loaded:", map); // ← Check this in console!
      setUsersMap(map);
      setUsersLoaded(true);
    });
  
    return unsub;
  }, []);

  // Listen to reports with filtering
  useEffect(() => {
    if (!usersLoaded) return;

    const reportsRef = collection(db, "reports");
    let q = query(reportsRef, orderBy("submittedAt", "desc"));

    const constraints: QueryConstraint[] = [];

    // Filter by employee (using email or name search in usersMap later)
    if (filters.employeeId) {
      // We'll do client-side filtering for name/email since Firestore can't search nested fields easily
      // Alternatively, store `userName` directly in report doc (recommended long-term)
    }

    // Date range: filter by submittedAt
    if (filters.startDate) {
      const start = Timestamp.fromDate(new Date(filters.startDate));
      constraints.push(where("submittedAt", ">=", start));
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // End of day
      const endTimestamp = Timestamp.fromDate(end);
      constraints.push(where("submittedAt", "<=", endTimestamp));
    }

    if (constraints.length > 0) {
      q = query(reportsRef, ...constraints, orderBy("submittedAt", "desc"));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      let reports: Report[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Report));

      // Client-side filtering for employee name/email
      if (filters.employeeId) {
        const lowerSearch = filters.employeeId.toLowerCase();
        reports = reports.filter((report) => {
          const user = usersMap[report.userId];
          const userName = user?.name || report.name || "";
          return (
            userName.toLowerCase().includes(lowerSearch) ||
            report.name?.toLowerCase().includes(lowerSearch)
          );
        });
      }

      // Optional: time range filtering (on timeStart/timeEnd strings)
      if (filters.startTime || filters.endTime) {
        reports = reports.filter((report) => {
          if (filters.startTime && report.timeStart < filters.startTime) return false;
          if (filters.endTime && report.timeEnd > filters.endTime) return false;
          return true;
        });
      }
      const enriched: EnrichedReport[] = reports.map((r) => ({
        ...r,
        userName:
          usersMap[r.userId]?.name ||
          r.name ||  // fallback if you saved email as name in report
          usersMap[r.userId]?.email ||
          "(Unknown User)",
      }));

      setGroupedReports(groupReportsByDate(enriched));
    });

    return unsub;
  }, [filters, usersLoaded, usersMap]);

  const handleMarkRead = async (reportId: string) => {
    const ref = doc(db, "reports", reportId);
  
    await updateDoc(ref, {
      status: "read",
      updatedAt: Timestamp.now(),
    });
  
    Swal.fire("Updated", "Report marked as read", "success");
  };
  const handleDelete = async (reportId: string) => {
    const ref = doc(db, "reports", reportId);
  
    const result = await Swal.fire({
      title: "Delete this report?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
  
    if (!result.isConfirmed) return;
  
    await deleteDoc(ref);
  
    Swal.fire("Deleted", "Report removed from database", "success");
  };
  // Rest of your render remains mostly same
  return (
    <section className="w-full h-auto overscroll-contain">
      <h2 className="heading text-center text-4xl">Report History</h2>
      <table className="w-full h-auto m-auto my-5">
        <thead className="border">
          <tr>
            <th className="w-1/8 text-2xl heading border">Date</th>
            <th className="w-1/8 text-2xl heading border">Employee</th>
            <th className="w-1/8 text-2xl heading border">Total Entries</th>
            <th className="w-4/8 text-2xl heading border">Entries</th>
            <th className="w-1/8 text-2xl heading border">Actions</th>
          </tr>
        </thead>
        <tbody className="border text-sm sm:text-base">
          {Object.keys(groupedReports).length === 0 ? (
            <tr>
              <td colSpan={5} className="text text-center py-4">
                No reports found
              </td>
            </tr>
          ) : (
            Object.entries(groupedReports).map(([date, reports]) => (
              <tr key={date}>
                <td className="text text-center border py-2">{date}</td>

                <td className="border py-2 px-2">
                  {Array.from(
                    new Set(
                      reports
                        .map((report) => {
                          const user = usersMap[report.userId];
                          return user?.name || user?.email || "(Unknown)";
                        })
                        .filter(Boolean)
                    )
                  ).map((name) => (
                    <div key={name} className="py-1">
                      {name}
                    </div>
                  ))}
                </td>

                <td className="border text-center py-2">{reports.length}</td>

                <td className="border py-2">
                  {reports.map((report) => (
                    <div key={report.id} className="w-4/5 m-auto p-2">
                      <Banner
                        date={`${report.timeStart} - ${report.timeEnd}`}
                        report={report.report}
                      />
                    </div>
                  ))}
                </td>

                <td className="text text-center border py-2">
                  {reports.map((report) => (
                    <div key={report.id} className="flex flex-col gap-2">
                      
                      {report.status !== "read" ? (
                        <button
                          className="btn px-3 py-1 border rounded"
                          onClick={() => handleMarkRead(report.id)}
                        >
                          Pending
                        </button>
                      ) : (
                        <span className="text-green-700 font-semibold">Read</span>
                      )}

                      <button
                        className="btn-delete px-3 py-1 border rounded text-red-700"
                        onClick={() => handleDelete(report.id)}
                      >
                        Delete
                      </button>

                    </div>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default Reports;
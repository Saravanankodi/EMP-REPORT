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

const groupReportsByDateAndUser = <T extends { submittedAt: Timestamp; userId: string }>(
  reports: T[]
): Record<string, T[]> => {
  return reports.reduce((acc, report) => {
    const dateKey = report.submittedAt.toDate().toLocaleDateString("en-GB");
    const groupKey = `${dateKey}__${report.userId}`; // 👈 important

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(report);

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

      setGroupedReports(groupReportsByDateAndUser(enriched));
    });

    return unsub;
  }, [filters, usersLoaded, usersMap]);

  const handleMarkReadGroup = async (reports: Report[]) => {
    const unread = reports.filter(r => r.status !== "read");
  
    if (unread.length === 0) {
      Swal.fire("Info", "All reports are already read", "info");
      return;
    }
  
    await Promise.all(
      unread.map((r) =>
        updateDoc(doc(db, "reports", r.id), {
          status: "read",
          updatedAt: Timestamp.now(),
        })
      )
    );
  
    Swal.fire("Updated", "All reports marked as read", "success");
  };
  
  const handleDeleteGroup = async (reports: Report[]) => {
    const result = await Swal.fire({
      title: "Delete all reports for this day?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
    });
  
    if (!result.isConfirmed) return;
  
    await Promise.all(
      reports.map((r) => deleteDoc(doc(db, "reports", r.id)))
    );
  
    Swal.fire("Deleted", "All reports removed", "success");
  };
  const formatToAmPm = (time24: string) => {
    if (!time24) return "";
  
    const [hours, minutes] = time24.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
  
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  // Rest of your render remains mostly same
  return (
    <section className="w-full h-auto overscroll-contain">
      <h2 className="heading text-center text-4xl">Report History</h2>
      <div className="max-sm:max-w-75 max-sm:max-h-80 max-sm:overflow-scroll m-auto">
        <table className="w-full h-auto m-auto my-5">
          <thead className="border">
            <tr>
              <th className="w-1/8 text-2xl heading border">Date</th>
              <th className="w-1/8 text-2xl heading border">Employee</th>
              <th className="w-1/8 text-2xl heading border">Total Entries</th>
              <th className="w-4/8 text-2xl heading border max-sm:min-w-max">Entries</th>
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
              Object.entries(groupedReports).map(([key, reports]) => {
                const [date, userId] = key.split("__");
                const user = usersMap[userId];

                return (
                  <tr key={key}>
                    <td className="text text-center border py-2">
                      {date}
                    </td>

                    <td className="border text-center py-2 px-2">
                      {user?.name || user?.email || "(Unknown)"}
                    </td>

                    <td className="border text-center py-2">
                      {reports.length}
                    </td>

                    <td className="border max-sm:min-w-max py-2">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          className="w-4/5 max-sm:w-full m-auto p-2"
                        >
                          <Banner
                            date={`${formatToAmPm(
                              report.timeStart
                            )} - ${formatToAmPm(
                              report.timeEnd
                            )}`}
                            report={report.report}
                          />
                        </div>
                      ))}
                    </td>

                    <td className="text text-center border py-2">
                      <div className="flex flex-col gap-2 items-center">
                        {reports.every(
                          (r) => r.status === "read"
                        ) ? (
                          <span className="text-green-700 font-semibold">
                            All Read
                          </span>
                        ) : (
                          <button
                            className="btn px-3 py-1 border rounded"
                            onClick={() =>
                              handleMarkReadGroup(reports)
                            }
                          >
                            Mark All Read
                          </button>
                        )}

                        <button
                          className="btn-delete px-3 py-1 border rounded text-red-700"
                          onClick={() =>
                            handleDeleteGroup(reports)
                          }
                        >
                          Delete All
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Reports;
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import {db,auth} from '../../lib/firebase'
import Banner from '../base/Banner'
import { Timestamp } from "firebase/firestore";

interface Report {
  id: string;
  userId: string;
  submittedAt: Timestamp;
  report : string;
  timeStart:string;
  timeEnd:string;
  status?: "pending" | "read";
}

type GroupedReports = Record<string, Report[]>;

const groupReportsByDate = (reports: Report[]): GroupedReports => {
  return reports.reduce((acc, report) => {
    if (!report.submittedAt) return acc;
    const dateKey = report.submittedAt.toDate().toLocaleDateString("en-GB");
 
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(report);
    return acc;
  }, {} as GroupedReports);
};


function History() {
  const [groupedReports, setGroupedReports] = useState<GroupedReports>({});

  useEffect(() => {
  if (!auth.currentUser) return;

  const reportsRef = collection(db, "reports");

  const q = query(
    reportsRef,
    where("userId", "==", auth.currentUser.uid),
    orderBy("submittedAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedReports: Report[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Report, "id">),
    }));

    setGroupedReports(groupReportsByDate(fetchedReports));
  });

  return () => unsubscribe();
}, []);

  
  return (
    <>
    <section className="w-full h-auto overscroll-contain">
        <h2 className="heading text-center text-2xl sm:text-4xl">
            Report History
        </h2>
        <div className="max-sm:max-w-75 max-sm:max-h-80 max-sm:overflow-scroll m-auto">
          <table className="w-full h-auto m-auto my-5 ">
              <thead className="border">
                  <tr>
                      <th className="w-1/5 text-base sm:text-2xl heading border">Date</th>
                      <th className="w-3/5 text-base sm:text-2xl heading border">Entries</th>
                      <th className="w-1/5 text-base sm:text-2xl heading border">Actions</th>
                  </tr>
              </thead>
              <tbody className="border text-sm sm:text-base">
                {Object.entries(groupedReports).length === 0 && (
                  <tr>
                    <td colSpan={3} className="text text-center">
                      No reports found
                    </td>
                  </tr>
                )}

                {Object.entries(groupedReports).map(([date, reports]) => (
                  
                  <tr key={date}>
                    {/* Date */}
                    <td className="text text-center border">{date}</td>

                    {/* Entries */}
                    <td className="border">
                      {reports.map((report) => (
                        <div key={report.id} className="w-4/5 m-auto p-2">
                          <Banner
                            date={`${report.timeStart} - ${report.timeEnd}`}
                            report={report.report}
                          />
                        </div>
                        
                      ))}
                    </td>

                    {/* Actions */}
                    <td className="text text-center border p-2">
                      {reports.some(r => r.status !== "read") ? (
                        <p className="text text-white h-12.5 w-24 bg-[#ffcc00] grid place-content-center m-auto rounded-xl">
                          Pending
                        </p>
                      ) : (
                        <p className="text text-white h-12.5 w-24 bg-[#008A2E] grid place-content-center m-auto rounded-xl">
                          Read
                        </p>
                      )}
                    </td>


                  </tr>
                ))}
              </tbody>

          </table>
        </div>
    </section>
    </>
  )
}

export default History
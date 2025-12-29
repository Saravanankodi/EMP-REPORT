import { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import {db} from '../../lib/firebase'
import Banner from '../base/Banner'
import { Timestamp } from "firebase/firestore";

interface Report {
  id: string;
  userId: string;
  submittedAt: Timestamp;
  report : string;
  timeStart:string;
  timeEnd:string;
  
}

type GroupedReports = Record<string, Report[]>;

const groupReportsByDate = (reports: Report[]): GroupedReports => {
  return reports.reduce((acc, report) => {
    const dateKey = report.submittedAt
      .toDate()
      .toLocaleDateString("en-GB");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(report);
    return acc;
  }, {} as GroupedReports);
};

function Reports() {
    const [groupedReports, setGroupedReports] = useState<GroupedReports>({});

    useEffect(() => {
      const reportsRef = collection(db, "reports");
  
      const q = query(reportsRef, orderBy("submittedAt", "desc"));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedReports: Report[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Report, "id">),
        }));
  
        setGroupedReports(groupReportsByDate(fetchedReports));
      });
  
      return unsubscribe;
    }, []);
  
  return (
    <>
    <section className="w-full h-auto overscroll-contain">
        <h2 className="heading text-center text-4xl">
            Report History
        </h2>
        <table className="w-full h-auto m-auto my-5">
            <thead className="border">
                <tr>
                    <th className="w-1/5 text-2xl heading border">Date</th>
                    <th className="w-3/5 text-2xl heading border">Entries</th>
                    <th className="w-1/5 text-2xl heading border">Actions</th>
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
                  <td className="text text-center border">
                    {/* future buttons like View / Delete */}
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
    </section>
    </>
  )
}

export default Reports
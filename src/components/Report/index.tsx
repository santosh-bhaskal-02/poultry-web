import { Bird, FilePlus, ClipboardCheck } from "lucide-react"; // Updated icons
import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import PreviousFinalReport from "../Records/PreviousFinalReport";

export default function FinalRreport() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-10 mb-20 px-4 sm:px-6 lg:px-8">
      {/* --- HEADER --- */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <Bird className="w-10 h-10 text-emerald-600" />
          <h1 className="text-4xl font-extrabold text-emerald-800 tracking-tight">
            Final Report
          </h1>
        </div>
      </header>

      {/* --- ACTION SECTION (Create Report) --- */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Card: Add Final Report */}
          <div className="md:col-span-1 p-6 rounded-2xl bg-white border border-emerald-300 shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <FilePlus className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-emerald-800">Create Final Report</h2>
            </div>

            <p className="text-base text-gray-600 leading-relaxed mb-6">
              **Finalize stock data** including boxes, birds per box, mortality rates, and
              total housed birds for the cycle.
            </p>

            <Button
              onClick={() => navigate("create")}
              className="bg-emerald-600 text-white hover:bg-emerald-700 w-full py-2 text-base font-semibold transition">
              Start New Report
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-3 mb-4 border-b pb-2 border-gray-200">
          <ClipboardCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="text-2xl font-semibold text-emerald-800">
            Stock Out Report History
          </h3>
        </div>

        <div className="w-full">
          <PreviousFinalReport />
        </div>
      </section>
    </div>
  );
}

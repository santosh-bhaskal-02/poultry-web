import { useState } from "react";
import dayjs from "dayjs";
import {
  BirdIcon,
  BoxIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  HashIcon,
  HomeIcon,
  PlusCircleIcon,
  SkullIcon,
  XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import InputField from "@/components/Common/InputField";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useCreateFinalReport from "@/hooks/FinalReport/useCreateFinalReport";
import { useParams } from "react-router-dom";
import useGetFinalReportById from "@/hooks/FinalReport/useGetFinalReportById";
import useUpdateFinalReport from "@/hooks/FinalReport/useUpdateFinalReport";
import Spinner from "@/components/Common/Spinner";

const validationSchema = Yup.object({
  batchNumber: Yup.string().required("Batch number is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date().required("End date is required"),
});

const recalcDerivedValues = (
  name: keyof FinalReportFormValues,
  rawValue: string,
  values: FinalReportFormValues,
  setFieldValue: (field: string, value: any) => void
) => {
  // Set the changed field first
  const num = rawValue === "" ? "" : Number(rawValue);
  setFieldValue(name, rawValue === "" ? "" : num);

  // Helper to safely get numeric values
  const numValue = (v: number | "" | undefined) =>
    v === "" || v === undefined || isNaN(Number(v)) ? 0 : Number(v);

  // 1) Bird section
  const totalBirds =
    name === "totalBirds" ? numValue(num as number) : numValue(values.totalBirds);
  const birdRate =
    name === "birdRate" ? numValue(num as number) : numValue(values.birdRate);

  const birdCost = totalBirds * birdRate;
  setFieldValue("birdCost", birdCost);

  // 2) Feed section
  const totalBags =
    name === "totalBags" ? numValue(num as number) : numValue(values.totalBags);
  const totalFeedKg = totalBags * 50; // Total Bags * 50
  setFieldValue("totalFeedKg", totalFeedKg);

  const feedRate =
    name === "feedRate" ? numValue(num as number) : numValue(values.feedRate);
  const feedCost = totalFeedKg * feedRate; // Total Feed KG * Rate
  setFieldValue("feedCost", feedCost);

  // 3) Stock out section
  const totalSoldBirds =
    name === "totalSoldBirds" ? numValue(num as number) : numValue(values.totalSoldBirds);
  const totalBirdsWeight =
    name === "totalBirdsWeight"
      ? numValue(num as number)
      : numValue(values.totalBirdsWeight);

  const avgBodyWeight = totalSoldBirds > 0 ? totalBirdsWeight / totalSoldBirds : 0; // Total Birds Weight / Total Sold Birds
  setFieldValue("avgBodyWeight", Number(avgBodyWeight.toFixed(2)));

  const chicksCost = birdCost;
  setFieldValue("chicksCost", chicksCost);

  const medicineCost =
    name === "medicineCost" ? numValue(num as number) : numValue(values.medicineCost);
  const adminCost =
    name === "adminCost" ? numValue(num as number) : numValue(values.adminCost);

  const grossProductionCost = chicksCost + feedCost + medicineCost + adminCost;
  setFieldValue("grossProductionCost", grossProductionCost);

  const netCostPerKg = totalBirdsWeight > 0 ? grossProductionCost / totalBirdsWeight : 0;
  const stdCostPerKg = numValue(values.stdCostPerKg);

  const productionCostIncentive = (stdCostPerKg - netCostPerKg) / 2;
  setFieldValue("productionCostIncentive", Number(productionCostIncentive.toFixed(2)));

  const rearingChargesStd = productionCostIncentive + 6.5;
  setFieldValue("rearingChargesStd", Number(rearingChargesStd.toFixed(2)));

  const rearingChargesPerBird = rearingChargesStd * avgBodyWeight;
  setFieldValue("rearingChargesPerBird", Number(rearingChargesPerBird.toFixed(2)));

  const totalRearingCharges = rearingChargesStd * totalBirdsWeight;
  setFieldValue("totalRearingCharges", Number(totalRearingCharges.toFixed(2)));

  setFieldValue("totalAmountPayable", Number(totalRearingCharges.toFixed(2)));
  setFieldValue("netCostPerKg", Number(netCostPerKg.toFixed(2)));
};

const FinalReportForm = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: finalReportData } = useGetFinalReportById(id);
  const { mutate: createFinalReport } = useCreateFinalReport();
  const { mutate: updateFinalReport, isPending: isUpdating } = useUpdateFinalReport();

  const [isStartCalendarOpen, setStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setEndCalendarOpen] = useState(false);

  const initialValues: FinalReportFormValues = {
    startDate: finalReportData?.data?.startDate
      ? new Date(finalReportData.data.startDate)
      : new Date(),

    endDate: finalReportData?.data?.endDate
      ? new Date(finalReportData.data.endDate)
      : new Date(),

    batchNumber: finalReportData?.data?.batchId ?? "",

    totalBirds: finalReportData?.data?.totalBirds ?? "",
    birdRate: finalReportData?.data?.birdRate ?? "",
    birdCost: finalReportData?.data?.birdCost ?? 0,

    totalBags: finalReportData?.data?.totalBags ?? "",
    totalFeedKg: finalReportData?.data?.totalFeedKg ?? 0,
    feedRate: finalReportData?.data?.feedRate ?? "",
    feedCost: finalReportData?.data?.feedCost ?? 0,

    totalSoldBirds: finalReportData?.data?.totalSoldBirds ?? "",
    totalBirdsWeight: finalReportData?.data?.totalBirdsWeight ?? "",
    avgBodyWeight: finalReportData?.data?.avgBodyWeight ?? 0,

    chicksCost: finalReportData?.data?.chicksCost ?? 0,
    medicineCost: finalReportData?.data?.medicineCost ?? "",
    adminCost: finalReportData?.data?.adminCost ?? "",
    grossProductionCost: finalReportData?.data?.grossProductionCost ?? 0,
    netCostPerKg: finalReportData?.data?.netCostPerKg ?? 0,
    stdCostPerKg: finalReportData?.data?.stdCostPerKg ?? 80,

    rearingChargesStd: finalReportData?.data?.rearingChargesStd ?? 0,
    productionCostIncentive: finalReportData?.data?.productionCostIncentive ?? 0,
    rearingChargesPerBird: finalReportData?.data?.rearingChargesPerBird ?? 0,
    totalRearingCharges: finalReportData?.data?.totalRearingCharges ?? 0,

    totalAmountPayable: finalReportData?.data?.totalAmountPayable ?? 0,
  };

  const handleUpdateReport = (updatedReport: FinalReportFormValues) => {
    updateFinalReport(
      { id, updatedReport },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Final report updated successfully");
          queryClient.invalidateQueries({ queryKey: ["get-final-report-by-id", id] });
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to update final report");
        },
      }
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const payload = {
          ...values,
          startDate: dayjs(values.startDate).toISOString(),
          endDate: dayjs(values.endDate).toISOString(),
        };

        createFinalReport(
          { finalReport: payload },
          {
            onSuccess: (res) => {
              toast.success(res?.message || "Final report created successfully");
              queryClient.invalidateQueries({ queryKey: ["get-dashboard"] });
              resetForm();
              setSubmitting(false);
            },
            onError: (error: any) => {
              toast.error(error?.message || "Failed to create final report");
              setSubmitting(false);
            },
          }
        );

        setSubmitting(false);
      }}>
      {({ values, setFieldValue, isSubmitting }) =>
        isSubmitting || isUpdating ? (
          <Spinner />
        ) : (
          <Form className="flex flex-col mb-20 gap-6 p-5 sm:p-7 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 shadow-xl rounded-2xl border-t-4 border-emerald-500 w-full">
            <h2 className="text-3xl font-extrabold text-emerald-700 text-center flex items-center justify-center gap-3">
              <BirdIcon className="w-9 h-9 text-emerald-600" />
              Batch Final Report
            </h2>

            <hr className="border-emerald-200" />

            {/* Batch Info */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 flex flex-col gap-4 w-full">
              <h3 className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
                <HashIcon className="w-5 h-5 text-emerald-600" /> Batch Information
              </h3>

              {/* Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <Label className="font-medium text-emerald-600 flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4 text-emerald-600" /> Batch Start Date
                  </Label>

                  <Popover open={isStartCalendarOpen} onOpenChange={setStartCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        id="startDate"
                        className="w-full h-11 justify-between font-medium border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                        {dayjs(values.startDate).format("DD/MM/YYYY")}
                        <ChevronDownIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Calendar
                        mode="single"
                        className="w-72"
                        selected={values.startDate}
                        onSelect={(d) => {
                          if (d) setFieldValue("startDate", d);
                          setStartCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-2 w-full">
                  <Label className="font-medium text-emerald-600 flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4 text-emerald-600" /> Batch End Date
                  </Label>

                  <Popover open={isEndCalendarOpen} onOpenChange={setEndCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        id="endDate"
                        className="w-full h-11 justify-between font-medium border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                        {dayjs(values.endDate).format("DD/MM/YYYY")}
                        <ChevronDownIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Calendar
                        mode="single"
                        className="w-72"
                        selected={values.endDate}
                        onSelect={(d) => {
                          if (d) setFieldValue("endDate", d);
                          setEndCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Batch No */}
                <InputField
                  label="Batch Number"
                  name="batchNumber"
                  type="number"
                  value={values.batchNumber}
                  onChange={(e) => setFieldValue("batchNumber", e.target.value)}
                  icon={<HashIcon className="w-4 h-4 text-emerald-600" />}
                />
              </div>
            </div>

            {/* Bird Quantities */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <BoxIcon className="w-5 h-5 text-emerald-600" /> Bird Quantities
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField
                  label="Total Birds"
                  name="totalBirds"
                  type="number"
                  value={values.totalBirds}
                  onChange={(e) =>
                    recalcDerivedValues(
                      "totalBirds",
                      e.target.value,
                      values,
                      setFieldValue
                    )
                  }
                  icon={<BoxIcon className="w-4 h-4 text-emerald-600" />}
                />

                <InputField
                  label="Rate (per bird)"
                  name="birdRate"
                  type="number"
                  value={values.birdRate}
                  onChange={(e) =>
                    recalcDerivedValues("birdRate", e.target.value, values, setFieldValue)
                  }
                />

                <InputField
                  label="Birds Cost"
                  name="birdCost"
                  type="number"
                  value={values.birdCost}
                  readOnly
                  onChange={() => {}}
                />
              </div>
            </div>

            {/* Feed Quantities */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <BoxIcon className="w-5 h-5 text-emerald-600" /> Feed Quantities
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <InputField
                  label="Total Bags"
                  name="totalBags"
                  type="number"
                  value={values.totalBags}
                  onChange={(e) =>
                    recalcDerivedValues(
                      "totalBags",
                      e.target.value,
                      values,
                      setFieldValue
                    )
                  }
                  icon={<BoxIcon className="w-4 h-4 text-emerald-600" />}
                />

                <InputField
                  label="Total Feed (Kg)"
                  name="totalFeedKg"
                  type="number"
                  value={values.totalFeedKg}
                  readOnly
                  onChange={() => {}}
                />

                <InputField
                  label="Feed Rate (per Kg)"
                  name="feedRate"
                  type="number"
                  value={values.feedRate}
                  onChange={(e) =>
                    recalcDerivedValues("feedRate", e.target.value, values, setFieldValue)
                  }
                />

                <InputField
                  label="Feed Cost"
                  name="feedCost"
                  type="number"
                  value={values.feedCost}
                  readOnly
                  onChange={() => {}}
                />
              </div>
            </div>

            {/* Stock Out */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <SkullIcon className="w-5 h-5 text-emerald-600" /> Stock Out
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField
                  label="Total Sold Birds"
                  name="totalSoldBirds"
                  type="number"
                  value={values.totalSoldBirds}
                  onChange={(e) =>
                    recalcDerivedValues(
                      "totalSoldBirds",
                      e.target.value,
                      values,
                      setFieldValue
                    )
                  }
                  icon={<SkullIcon className="w-4 h-4 text-emerald-600" />}
                />

                <InputField
                  label="Total Birds Weight (Kg)"
                  name="totalBirdsWeight"
                  type="number"
                  value={values.totalBirdsWeight}
                  onChange={(e) =>
                    recalcDerivedValues(
                      "totalBirdsWeight",
                      e.target.value,
                      values,
                      setFieldValue
                    )
                  }
                />

                <InputField
                  label="Average Body Weight (Kg)"
                  name="avgBodyWeight"
                  type="string"
                  value={values.avgBodyWeight}
                  readOnly
                  onChange={() => {}}
                />
              </div>
            </div>

            {/* Batch Expenses */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <SkullIcon className="w-5 h-5 text-emerald-600" /> Batch Expenses
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField
                  label="Chicks Cost"
                  name="chicksCost"
                  type="number"
                  value={values.chicksCost}
                  readOnly
                  onChange={() => {}}
                />

                <InputField
                  label="Feed Cost"
                  name="feedCostExpense"
                  type="number"
                  value={values.feedCost}
                  readOnly
                  onChange={() => {}}
                />

                <InputField
                  label="Medicine Cost"
                  name="medicineCost"
                  type="number"
                  value={values.medicineCost}
                  onChange={(e) =>
                    recalcDerivedValues(
                      "medicineCost",
                      e.target.value,
                      values,
                      setFieldValue
                    )
                  }
                />

                <InputField
                  label="Admin Cost"
                  name="adminCost"
                  type="number"
                  value={values.adminCost}
                  onChange={(e) =>
                    recalcDerivedValues(
                      "adminCost",
                      e.target.value,
                      values,
                      setFieldValue
                    )
                  }
                />

                <InputField
                  label="Gross Production Cost"
                  name="grossProductionCost"
                  type="string"
                  value={values.grossProductionCost}
                  readOnly
                  onChange={() => {}}
                  icon={<PlusCircleIcon className="w-4 h-4 text-emerald-600" />}
                />

                <InputField
                  label="Net Cost / Kg"
                  name="netCostPerKg"
                  type="string"
                  value={values.netCostPerKg}
                  readOnly
                  onChange={() => {}}
                />

                <InputField
                  label="Std. Cost / Kg"
                  name="stdCostPerKg"
                  type="string"
                  value={values.stdCostPerKg}
                  readOnly
                  onChange={() => {}}
                />
              </div>
            </div>

            {/* Rearing Charges */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <SkullIcon className="w-5 h-5 text-emerald-600" /> Rearing Charges
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Rearing Charges (Std. 6.50)"
                  name="rearingChargesStd"
                  type="string"
                  value={values.rearingChargesStd}
                  readOnly
                  onChange={() => {}}
                />

                <InputField
                  label="Prod. Cost Incentive"
                  name="productionCostIncentive"
                  type="string"
                  value={values.productionCostIncentive}
                  readOnly
                  onChange={() => {}}
                />

                <InputField
                  label="Rearing Charges Per Bird"
                  name="rearingChargesPerBird"
                  type="string"
                  value={values.rearingChargesPerBird}
                  readOnly
                  onChange={() => {}}
                />

                <InputField
                  label="Total Rearing Charges"
                  name="totalRearingCharges"
                  type="string"
                  value={values.totalRearingCharges}
                  readOnly
                  onChange={() => {}}
                />
              </div>
            </div>

            {/* Final Bill */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-emerald-100 w-full">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-emerald-600" /> Final Bill
              </h3>

              <InputField
                label="Total Amount Payable"
                name="totalAmountPayable"
                type="string"
                value={values.totalAmountPayable}
                readOnly
                onChange={() => {}}
                icon={<HomeIcon className="w-4 h-4 text-emerald-600" />}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-2">
              <Button
                type="reset"
                className="w-auto px-4 h-11 bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold flex items-center gap-2 rounded-lg cursor-pointer">
                <XCircleIcon className="w-5 h-5" /> Cancel
              </Button>

              <Button
                disabled={isSubmitting || isUpdating}
                type={finalReportData?.data ? "button" : "submit"}
                onClick={
                  finalReportData?.data ? () => handleUpdateReport(values) : undefined
                }
                className="w-auto px-4 h-11 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-lg flex items-center gap-2 rounded-lg cursor-pointer">
                {isSubmitting || isUpdating ? (
                  "Submitting..."
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    {finalReportData?.data ? "Update Report" : "Submit Entry"}
                  </>
                )}
              </Button>
            </div>
          </Form>
        )
      }
    </Formik>
  );
};

export default FinalReportForm;

interface FinalReportFormValues {
  startDate: Date;
  endDate: Date;
  batchNumber: string;

  // Bird quantities
  totalBirds: number | "";
  birdRate: number | "";
  birdCost: number;

  // Feed quantities
  totalBags: number | "";
  totalFeedKg: number;
  feedRate: number | "";
  feedCost: number;

  // Stock out
  totalSoldBirds: number | "";
  totalBirdsWeight: number | "";
  avgBodyWeight: number;

  // Batch expenses
  chicksCost: number;
  medicineCost: number | "";
  adminCost: number | "";
  grossProductionCost: number;
  netCostPerKg: number;
  stdCostPerKg: number;

  // Rearing charges
  rearingChargesStd: number;
  productionCostIncentive: number;
  rearingChargesPerBird: number;
  totalRearingCharges: number;

  // Final bill
  totalAmountPayable: number;
}

import type dayjs from "dayjs";

/* ------------------- STOCK OUT ENTRY (TABLE ROW) ------------------- */
export interface StockOutEntryFormData {
  id?: number; // for updates/deletes
  srNo: number;
  birds: number;
  weight: number;
}

/* ------------------- MASTER CREATION FORM ------------------- */
export interface StockOutMasterFormData {
  id?: number;
  date: string | dayjs.Dayjs;
  batchId?: number | string;
  stockOutNo: number | string;

  // table
  entries?: StockOutEntryFormData[];

  // summary
  totalBirds: number;
  totalWeight: number;
  avgWeight: number;
}

/* ------------------- API RESPONSE TYPES ------------------- */
export interface StockOutEntryResponse {
  id: number;
  srNo: number;
  birds: number;
  weight: number;
  stockOutMasterId: number;
}

export interface StockOutMasterResponse {
  id: number;
  date: string;
  batchId: number;
  stockOutNo: number;

  totalBirds: number;
  totalWeight: number;
  avgWeight: number;

  entries?: StockOutEntryResponse[];
}

type StockOutEntry = {
  id?: number;
  srNo?: number;
  StockOutMasterId: string | number;
  birds: number;
  weight: number;
};

interface StockOutFormValues {
  date: Date | string;
  batchNo?: string | numbeer;
  stockOutNo: numbeer | string;
  birdsToAdd: string;
  weightToAdd: string;
}

interface UpdatedBirdInventoryFormData {
  date: string;
  batchNo?: number;
  stockOutNo: number;
  entries: StockOutEntry[];
  totalBirds: number;
  totalWeight: number;
  avgWeight: number;
}

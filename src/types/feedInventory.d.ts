import type dayjs from "dayjs";

export interface FeedInventoryFormData {
  id?: string | number;
  date: string | dayjs;
  batchNo?: number | string;
  feedName: number | string;
  bagsArrivedCount: number | string;
  driverName: number | string;
  driverPhoneNumber: number | string;
}

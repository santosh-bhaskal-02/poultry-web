import type dayjs from "dayjs";

export interface DailyRecordFormData {
  id?: number | string;
  date: string | dayjs;
  birdAgeInDays: number | string;
  feedConsumedBags: number | string;
  mortalityCount: number | string;
}

export interface DailyRecordResponse {
  id: number;
  date: string;
  birdAgeInDays: number;
  feedConsumedBags: number;
  mortalityCount: number;
}

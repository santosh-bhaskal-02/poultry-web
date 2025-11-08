export interface DailyRecordFormData {
  birdAgeInDays: string;
  feedConsumedBags: string;
  mortalityCount: string;
}

export interface DailyRecordResponse {
  id: number;
  date: string;
  birdAgeInDays: number;
  feedConsumedBags: number;
  mortalityCount: number;
}

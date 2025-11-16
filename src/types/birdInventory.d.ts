import type dayjs from "dayjs";

export interface BirdInventoryFormData {
  date: string | dayjs;
  batchNo: number | string;
  boxCount: number | string; // Total number of boxes
  birdsPerBoxCount: number | string; // Birds per box
  totalBirdCount: number | string; // boxCount * birdsPerBoxCount
  birdsArrivedCount: number | string; // Birds arrived in this batch
  boxMortalityCount: number | string; // Dead birds in boxes
  disabledBirdCount: number | string; // Birds that cannot walk / leg issues
  weakBirdCount: number | string; // Weak but active birds
  shortBirdCount: number | string;
  excessBirdCount: number | string; // Extra birds found
  housedBirdCount: number | string; // Birds housed after adjustments
}

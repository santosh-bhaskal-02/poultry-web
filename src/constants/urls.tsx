//DASHBOARD
export const GET_DASHBOARD = "api/dashboard";

//DAILY RECORD
export const CREATE_DAILY_RECORD = "api/dailyrecord";
export const GET_ALL_DAILY_RECORD = "api/dailyrecord";
export const UPDATE_DAILY_RECORD = (id: string | number) => `api/dailyrecord/${id}`;
export const DELETE_DAILY_RECORD = (id: string) => `api/dailyrecord/soft-delete/${id}`;

//BIRD INVENTORY
export const CREATE_BIRD_INVENTORY = "api/birdsinventory";
export const GET_ALL_BIRD_INVNETORY = "api/birdsinventory";
export const UPDATE_BIRD_INVENTORY = (id: string | number) => `api/birdsinventory/${id}`;
export const DELETE_BIRD_INVENTORY = (id: string | number) =>
  `api/birdsinventory/soft-delete/${id}`;

//FEED INVENTORY
export const CREATE_FEED_INVENTORY = "api/feedinventory";
export const GET_ALL_FEED_INVNETORY = "api/feedinventory";
export const UPDATE_FEED_INVENTORY = (id: string | number) => `api/feedinventory/${id}`;
export const DELETE_FEED_INVENTORY = (id: string | number) =>
  `api/feedinventory/soft-delete/${id}`;

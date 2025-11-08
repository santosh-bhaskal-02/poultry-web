//DASHBOARD
export const GET_DASHBOARD = "api/dashboard";

//DAILY RECORD
export const CREATE_DAILY_RECORD = "api/dailyrecord";
export const GET_ALL_DAILY_RECORD = "api/dailyrecord";
export const UPDATE_DAILY_RECORD = (id: string) => `api/dailyrecord/${id}`;
export const DELETE_DAILY_RECORD = (id: string) => `api/dailyrecord/${id}`;

//BIRD INVENTORY
export const CREATE_BIRD_INVENTORY = "api/birdinventory";
export const GET_ALL_BIRD_INVNETORY = "api/birdinventory";
export const UPDATE_BIRD_INVENTORY = (id: string) => `api/birdinventory/${id}`;
export const DELETE_BIRD_INVENTORY = (id: string) => `api/birdinventory/${id}`;

//FEED INVENTORY
export const CREATE_FEED_INVENTORY = "api/birdinventory";
export const GET_ALL_FEED_INVNETORY = "api/birdinventory";
export const UPDATE_FEED_INVENTORY = (id: string) => `api/birdinventory/${id}`;
export const DELETE_FEED_INVENTORY = (id: string) => `api/birdinventory/${id}`;

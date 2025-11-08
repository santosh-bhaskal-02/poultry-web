export const HERDER_WITH_JSON = {
  "Content-Type": "application/json",
};

export const HEADER_WITH_JSON_AND_TOKEN = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: token ? `Bearer ${token}` : "",
});

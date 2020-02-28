const weekms: number = 7 * 86400 * 1000; // A week of milliseconds
const now: number = new Date().setHours(0, 0, 0); // Midnight today
const weekAgo: number = now - weekms; // A week ago
const fortnightsTime: number = now + weekms * 2; // Two week's time

// Is a given date later than a week ago
export const inTheLastWeek = (dateStr: string) => {
  return Date.parse(dateStr) >= weekAgo;
};

// Is a given date before a fortnight's time
export const inTheNextFortnight = (dateStr: string) => {
  return Date.parse(dateStr) <= fortnightsTime;
};

// Is a date in the future
export const notStartedYet = (dateStr: string) => {
  return Date.parse(dateStr) > now;
};

// Is a date in the past
export const finished = (dateStr: string) => {
  return Date.parse(dateStr) < now;
};

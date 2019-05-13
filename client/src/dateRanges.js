const weekms = 7 * 86400 * 1000; // A week of milliseconds
const now = Date.now(); // Now, obviously :-)
const weekAgo = now - weekms; // A week ago
const fortnightsTime = now + weekms * 2; // Two week's time

// Is a given date later than a week ago
export const inTheLastWeek = dateStr => {
  return Date.parse(dateStr) >= weekAgo;
};

// Is a given date before a fortnight's time
export const inTheNextFortnight = dateStr => {
  return Date.parse(dateStr) <= fortnightsTime;
};

// Is a date in the future
export const notStartedYet = dateStr => {
  return Date.parse(dateStr) > now;
};

// Is a date in the past
export const finished = dateStr => {
  return Date.parse(dateStr) < now;
};

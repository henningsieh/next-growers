const isoString = "2023-05-19T18:36:19.568Z";

// Format: May 19, 2023 (en-US)
export const dateFormatterEnUS = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
export const formattedDateEnUS = dateFormatterEnUS.format(new Date(isoString));
console.log(formattedDateEnUS); // Output: "May 19, 2023"

// Format: May 19, 2023, 06:36 PM (en-US)
export const dateTimeFormatterEnUS = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
export const formattedDateTimeEnUS = dateTimeFormatterEnUS.format(
  new Date(isoString)
);
console.log(formattedDateTimeEnUS); // Output: "May 19, 2023, 06:36 PM"

// Format: 18. Mai 2023 (de-DE)
export const dateFormatterDeDE = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export const formattedDateDeDE = dateFormatterDeDE.format(new Date(isoString));
console.log(formattedDateDeDE); // Output: "18. Mai 2023"

// Format: 18. Mai 2023, 18:36 (de-DE)
export const dateTimeFormatterDeDE = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
});
export const formattedDateTimeDeDE = dateTimeFormatterDeDE.format(
  new Date(isoString)
);
console.log(formattedDateTimeDeDE); // Output: "18. Mai 2023, 18:36"

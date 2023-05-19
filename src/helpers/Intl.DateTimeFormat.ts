const isoString = "2023-05-19T18:36:19.568Z";

// Format: May 19, 2023 (en-US)
const dateFormatterEnUS = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
const formattedDateEnUS = dateFormatterEnUS.format(new Date(isoString));
console.log(formattedDateEnUS); // Output: "May 19, 2023"

// Format: May 19, 2023, 06:36 PM (en-US)
const dateTimeFormatterEnUS = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});
const formattedDateTimeEnUS = dateTimeFormatterEnUS.format(new Date(isoString));
console.log(formattedDateTimeEnUS); // Output: "May 19, 2023, 06:36 PM"

// Format: 18. Mai 2023 (de-DE)
const dateFormatterDeDE = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const formattedDateDeDE = dateFormatterDeDE.format(new Date(isoString));
console.log(formattedDateDeDE); // Output: "18. Mai 2023"

// Format: 18. Mai 2023, 18:36 (de-DE)
const dateTimeFormatterDeDE = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
});
const formattedDateTimeDeDE = dateTimeFormatterDeDE.format(new Date(isoString));
console.log(formattedDateTimeDeDE); // Output: "18. Mai 2023, 18:36"

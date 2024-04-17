import { convert } from "html-to-text";

export function getDescription(
  description: string | null | undefined,
  wordwrap: number | null | undefined = 10
): string {
  if (!description) {
    description = "Growtagebuch von GrowAGram.com";
  } else {
    description = `GrowAGram.com | ${description}`;
  }

  description = convert(description, { wordwrap: wordwrap });
  return description
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\r/g, " ");
}

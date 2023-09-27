export function formatText(text) {
  // Split the text into paragraphs based on newline characters
  const paragraphs = text.split("\n");

  // Remove empty paragraphs and trim whitespace
  const formattedParagraphs = paragraphs
    .filter((paragraph) => paragraph.trim() !== "")
    .map((paragraph) => paragraph.trim());

  // Join the paragraphs back together with newline characters
  const formattedText = formattedParagraphs.join("\n");

  return formattedText;
}

/** Descriptions for dynamic prompt tokens shown in the Tokens sidebar. */
export const PROMPT_TOKEN_INFO: Record<string, string> = {
  '{itemName}': 'The recognized name of the product or item.',
  '{category}': 'The assigned wishlist category for the item.',
  '{url}': 'The direct URL link to the product page.',
  '{pageContext}': 'Extracted visible text from the scraped webpage.',
  '{price}': 'The detected numerical price of the item.',
  '{websiteName}': 'The domain name or brand of the store.',
  '{existingNotes}': 'Any notes currently written by the user in the form.',
  '{itemContext}': 'Additional context like detected sizes or user preferences.',
  '{searchContext}': 'Context gathered from related web search results.',
  '{existingCategories}': 'List of categories already present on the wishlist.',
  '{fileName}': 'The name of the uploaded import file.',
  '{format}': 'The detected file format (e.g., CSV, PDF).',
  '{fileContent}': 'The raw extracted content from the import file.',
  '{wishlistTitle}': 'The title of the wishlist receiving the imported items.',
};

export function getPromptTokenDescription(token: string): string {
  return PROMPT_TOKEN_INFO[token] ?? 'Dynamic value populated at runtime.';
}

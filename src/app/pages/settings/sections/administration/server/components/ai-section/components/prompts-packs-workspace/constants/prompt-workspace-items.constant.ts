import type { PromptWorkspaceItem } from '../interfaces/prompt-workspace-item.interface';

export const PROMPT_PLACEHOLDER = 'Loaded from server defaults; edit and save to customize.';

export const PROMPT_WORKSPACE_ITEMS: readonly PromptWorkspaceItem[] = [
  {
    id: 'populate',
    label: 'Populate',
    description:
      'Auto-fill item fields from a product URL. Base prompt executed before pack fragments.',
    tokens: ['{url}', '{websiteName}', '{pageContext}', '{searchContext}', '{itemName}', '{category}'],
    icon: 'terminal',
  },
  {
    id: 'review',
    label: 'Review Summaries',
    description: 'AI review synthesis on item links (pros, cons, and summary).',
    tokens: ['{itemName}', '{category}', '{url}', '{pageContext}'],
    icon: 'message',
  },
  {
    id: 'import',
    label: 'File Import',
    description: 'Turn unstructured file uploads into structured wishlist items.',
    tokens: ['{fileName}', '{format}', '{fileContent}', '{wishlistTitle}', '{existingCategories}'],
    icon: 'file',
  },
  {
    id: 'description',
    label: 'Auto-Description',
    description: 'Write concise notes for items when auto-filling or clicking summarize.',
    tokens: [
      '{itemName}',
      '{category}',
      '{url}',
      '{price}',
      '{websiteName}',
      '{existingNotes}',
      '{itemContext}',
    ],
    icon: 'edit',
  },
  {
    id: 'category',
    label: 'Auto-Category',
    description: 'Classify items into tailored categories when auto-filling from a URL.',
    tokens: ['{url}', '{websiteName}', '{pageContext}', '{itemName}', '{existingCategories}'],
    icon: 'tag',
  },
];

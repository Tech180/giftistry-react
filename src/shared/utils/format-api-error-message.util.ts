const FIELD_LABELS: Record<string, string> = {
  Password: 'Password',
  Username: 'Username',
  FirstName: 'First name',
  LastName: 'Last name',
  Email: 'Email',
  DbUrl: 'Database URL',
  PublicAppUrl: 'Public app URL',
};

interface ValidationErrorNode {
  type?: string | number;
  message?: string;
  summary?: string;
  property?: string;
  path?: string;
  schema?: { minLength?: number; maxLength?: number; type?: string };
  errors?: ValidationErrorNode[];
}

function fieldLabelFromPath(path?: string): string | null {
  if (!path) return null;
  const segment = path.split('/').filter(Boolean).pop();
  if (!segment) return null;
  return FIELD_LABELS[segment] ?? segment.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function friendlyRuleMessage(node: ValidationErrorNode, fieldLabel: string | null): string {
  const minLength = node.schema?.minLength;
  const maxLength = node.schema?.maxLength;
  const raw = node.summary || node.message || '';

  if (
    typeof minLength === 'number' ||
    /length greater or equal|minLength|at least/i.test(raw)
  ) {
    const length = minLength ?? (raw.match(/\d+/) ? Number(raw.match(/\d+/)![0]) : undefined);
    if (typeof length === 'number') {
      return fieldLabel
        ? `${fieldLabel} must be at least ${length} characters.`
        : `Must be at least ${length} characters.`;
    }
  }

  if (
    typeof maxLength === 'number' ||
    /length less or equal|maxLength|at most/i.test(raw)
  ) {
    const length = maxLength ?? (raw.match(/\d+/) ? Number(raw.match(/\d+/)![0]) : undefined);
    if (typeof length === 'number') {
      return fieldLabel
        ? `${fieldLabel} must be at most ${length} characters.`
        : `Must be at most ${length} characters.`;
    }
  }

  if (/^expected string$/i.test(raw.trim()) && fieldLabel) {
    return `${fieldLabel} is required.`;
  }

  if (raw && fieldLabel && !raw.toLowerCase().includes(fieldLabel.toLowerCase())) {
    return `${fieldLabel}: ${raw}`;
  }

  return raw || (fieldLabel ? `Invalid ${fieldLabel.toLowerCase()}.` : 'Validation failed.');
}

function collectValidationMessages(node: ValidationErrorNode): string[] {
  const messages: string[] = [];
  const path = node.path || node.property;
  const label = fieldLabelFromPath(path);

  if (Array.isArray(node.errors) && node.errors.length > 0) {
    for (const child of node.errors) {
      messages.push(...collectValidationMessages(child));
    }
    return messages;
  }

  if (node.message || node.summary || node.schema) {
    messages.push(friendlyRuleMessage(node, label));
  }

  return messages;
}

function parseValidationPayload(raw: unknown): ValidationErrorNode | null {
  if (raw == null) return null;

  let value: unknown = raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
      return null;
    }
    try {
      value = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }

  if (typeof value !== 'object' || value === null) return null;
  const obj = value as ValidationErrorNode;
  if (obj.type === 'validation' || Array.isArray(obj.errors) || obj.property || obj.path) {
    return obj;
  }
  return null;
}

/** Turn API validation / error payloads into a short user-facing message. */
export function formatApiErrorMessage(
  raw: unknown,
  fallback = 'An error occurred'
): string {
  if (raw == null || raw === '') return fallback;

  if (typeof raw === 'string') {
    const parsed = parseValidationPayload(raw);
    if (!parsed) return raw;
    const messages = collectValidationMessages(parsed);
    return messages[0] || raw;
  }

  if (typeof raw === 'object') {
    const parsed = parseValidationPayload(raw);
    if (parsed) {
      const messages = collectValidationMessages(parsed);
      if (messages.length > 0) return messages.join(' ');
    }

    const obj = raw as { Message?: unknown; message?: unknown; summary?: unknown };
    if (typeof obj.Message === 'string') return formatApiErrorMessage(obj.Message, fallback);
    if (typeof obj.message === 'string') return formatApiErrorMessage(obj.message, fallback);
    if (typeof obj.summary === 'string') return obj.summary;
  }

  return fallback;
}

/** Map a validation payload to field keys used by forms (e.g. adminPassword). */
export function mapValidationErrorsToFields(
  raw: unknown,
  fieldMap: Record<string, string>
): Record<string, string> {
  const parsed = parseValidationPayload(raw);
  if (!parsed) return {};

  const result: Record<string, string> = {};
  const stack: ValidationErrorNode[] = [parsed];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (Array.isArray(node.errors)) {
      stack.push(...node.errors);
    }

    const path = node.path || node.property;
    if (!path) continue;

    const segment = path.split('/').filter(Boolean).pop();
    if (!segment) continue;

    const fieldKey = fieldMap[segment];
    if (!fieldKey || result[fieldKey]) continue;

    result[fieldKey] = friendlyRuleMessage(node, fieldLabelFromPath(path));
  }

  return result;
}

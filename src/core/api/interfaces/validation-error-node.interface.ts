export interface ValidationErrorNode {
  type?: string | number;
  message?: string;
  summary?: string;
  property?: string;
  path?: string;
  schema?: { minLength?: number; maxLength?: number; type?: string };
  errors?: ValidationErrorNode[];
}

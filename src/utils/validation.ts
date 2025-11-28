export type FieldError = { field: string; message: string };

export const required = (label: string, value: unknown): FieldError | null =>
  (value === undefined || value === null || value === '' ? { field: label, message: `${label} is required` } : null);

export const min = (label: string, value: number, n: number): FieldError | null =>
  (Number.isNaN(value) || value < n ? { field: label, message: `${label} must be at least ${n}` } : null);

export const email = (label: string, value: string): FieldError | null =>
  (/^\S+@\S+\.\S+$/.test(value) ? null : { field: label, message: `Invalid ${label}` });

export const collectErrors = (...errs: Array<FieldError | null>): FieldError[] =>
  errs.filter(Boolean) as FieldError[];

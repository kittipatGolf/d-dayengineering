type ValidationResult = { valid: true } | { valid: false; error: string };

export function validateRequired(
  body: Record<string, unknown>,
  fields: string[],
): ValidationResult {
  const missing = fields.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === "",
  );
  if (missing.length > 0) {
    return { valid: false, error: `Missing required fields: ${missing.join(", ")}` };
  }
  return { valid: true };
}

export function validateEnum(
  value: unknown,
  allowed: string[],
): ValidationResult {
  if (typeof value !== "string" || !allowed.includes(value)) {
    return { valid: false, error: `Invalid value. Allowed: ${allowed.join(", ")}` };
  }
  return { valid: true };
}

export function validateNumber(value: unknown): ValidationResult {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (typeof n !== "number" || !isFinite(n) || n < 0) {
    return { valid: false, error: `Invalid number: ${value}` };
  }
  return { valid: true };
}

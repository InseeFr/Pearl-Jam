export const displayValue = (value?: string | number, fallback = '-') => {
  return value ?? fallback;
};

export const displayBoolean = (
  value: boolean | undefined,
  trueLabel: string,
  falseLabel: string,
  fallback = '-'
) => {
  if (value === undefined || value === null) return fallback;
  return value ? trueLabel : falseLabel;
};

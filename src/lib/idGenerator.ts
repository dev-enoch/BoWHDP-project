export function generateShortId(prefix: string): string {
  // e.g., prefix = 'BO-PRJ'
  // Generate 8 random numbers
  const chars = '0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${id}`;
}

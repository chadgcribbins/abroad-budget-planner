export interface Country {
  code: string; // e.g., 'GB', 'PT'
  name: string; // e.g., 'United Kingdom', 'Portugal'
  flag: string; // e.g., Emoji flag or path to an SVG/image
}

export const countries: Country[] = [
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  // Add more countries later
]; 
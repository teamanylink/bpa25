/**
 * Format a duration in seconds to a readable string
 * Examples: 
 * - 65 seconds -> "1:05" 
 * - 3600 seconds -> "1:00:00"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/**
 * Format a date string to a readable format
 * Example: "2023-03-15T14:30:00Z" -> "Mar 15, 2023"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a number with suffixes like K for thousands, M for millions
 * Example: 1500 -> "1.5K", 1500000 -> "1.5M"
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  
  if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

/**
 * Strip HTML tags from a string
 */
export function stripHtmlTags(text: string): string {
  if (!text) return '';
  return text.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Convert hex color to RGBA
 */
export function convertHexToRGBA(hex: string, opacity: number): string {
  let r = 0, g = 0, b = 0;
  
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } 
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
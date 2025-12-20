/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');

/**
 * Convert a relative image URL to a full URL
 * @param imageUrl - The image URL from the API (could be relative or absolute)
 * @returns Full image URL
 */
export function getFullImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return '';
  }

  // If it's already a full URL (starts with http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative URL, prepend the backend base URL
  if (imageUrl.startsWith('/')) {
    return `${BACKEND_BASE_URL}${imageUrl}`;
  }

  // If it doesn't start with /, add it
  return `${BACKEND_BASE_URL}/${imageUrl}`;
}

/**
 * Get a placeholder image URL for when the main image fails to load
 * @param productName - Name of the product for the placeholder text
 * @param width - Width of the placeholder image
 * @param height - Height of the placeholder image
 * @returns Placeholder image URL
 */
export function getPlaceholderImageUrl(
  productName: string, 
  width: number = 300, 
  height: number = 400
): string {
  const encodedName = encodeURIComponent(productName);
  return `https://via.placeholder.com/${width}x${height}/f5f5f5/cccccc/?text=${encodedName}`;
}
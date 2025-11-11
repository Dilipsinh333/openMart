/**
 * Constructs the full image URL by combining base URL with relative path
 * @param imagePath - The relative image path from the backend
 * @returns The complete image URL or placeholder if path is empty
 */
export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) {
    return "/vite.svg"; // fallback to vite.svg as placeholder
  }
  return imagePath;
  // const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000/";
  // return `${baseUrl}${imagePath}`;
};

/**
 * Handles image loading errors by setting a fallback placeholder
 * @param event - The error event from img element
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>
) => {
  const target = event.target as HTMLImageElement;
  target.src = "/vite.svg";
};

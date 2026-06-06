/**
 * Utility functions for handling vehicle images
 */

/**
 * Format image data for display
 * Handles various image formats (base64 string, data URL, byte array)
 * @param {string | null} imageData - The image data to format
 * @returns {string | null} - Formatted image URL or null
 */
export const formatImage = (imageData) => {
    if (!imageData) {
        return null;
    }

    // If it's already a data URL, return as is
    if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        return imageData;
    }

    // If it's a base64 string without data URL prefix, add it
    if (typeof imageData === 'string' && imageData.length > 0) {
        return `data:image/jpeg;base64,${imageData}`;
    }

    return null;
};

/**
 * Get placeholder image URL or component
 * @returns {string} - Placeholder image URL or message
 */
export const getImagePlaceholder = () => {
    return 'https://via.placeholder.com/400x300?text=No+Image';
};

/**
 * Check if image data is valid
 * @param {any} imageData - The image data to validate
 * @returns {boolean} - True if image data is valid
 */
export const isValidImage = (imageData) => {
    if (!imageData) return false;

    if (typeof imageData === 'string') {
        return imageData.length > 0;
    }

    if (imageData instanceof ArrayBuffer || imageData instanceof Uint8Array) {
        return imageData.byteLength > 0;
    }

    return false;
};

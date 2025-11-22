/**
 * Error handling utilities for database operations
 * Provides user-friendly error messages for common database errors
 */

/**
 * Converts database errors to user-friendly messages
 * @param {Error} error - The original error from Supabase
 * @param {string} operation - The operation being performed (e.g., 'delete', 'create')
 * @param {string} entityType - The type of entity (e.g., 'team', 'badge', 'nameset')
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error, operation, entityType) {
  // Handle case where error might not be an Error object
  if (!error || typeof error !== 'object') {
    return `Failed to ${operation} ${entityType}`;
  }
  // Handle Supabase/PostgreSQL error codes
  if (error.code) {
    switch (error.code) {
      case '23503': // Foreign key constraint violation
        return `Cannot ${operation} this ${entityType} because it is being used by other items. Please remove all references first.`;

      case '23505': // Unique constraint violation
        return `A ${entityType} with this name already exists. Please choose a different name.`;

      case '23514': // Check constraint violation
        return `Invalid data provided for ${entityType}. Please check your input.`;

      case '42501': // Row Level Security policy violation
        return `You don't have permission to ${operation} this ${entityType}.`;

      case '22P02': // Invalid input syntax
        return `Invalid data format for ${entityType}. Please check your input.`;

      case 'PGRST116': // Not found
        return `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found.`;

      default:
        return `Database error: ${error.message}`;
    }
  }

  // Handle network/connection errors
  if (error.message) {
    if (error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
  }

  // Fallback to original error message
  return error.message || `Failed to ${operation} ${entityType}`;
}

/**
 * Checks if an error is a foreign key constraint violation
 * @param {Error} error - The error to check
 * @returns {boolean} True if it's a foreign key constraint violation
 */
export function isForeignKeyConstraintError(error) {
  return error && error.code === '23503';
}

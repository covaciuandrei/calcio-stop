import React, { useEffect } from 'react';
import './ErrorToast.css';

interface ErrorToastProps {
  error: string | null;
  onClose: () => void;
  type?: 'error' | 'warning' | 'info';
  showArchiveSuggestion?: boolean;
  onArchive?: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  error,
  onClose,
  type = 'error',
  showArchiveSuggestion = false,
  onArchive,
}) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  const isForeignKeyError = error.includes('being used by other items');

  return (
    <div className={`error-toast ${type} ${isForeignKeyError ? 'foreign-key-error' : ''}`}>
      <div className="error-toast-content">
        <div className="error-toast-icon">
          {type === 'error' && '⚠️'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </div>

        <div className="error-toast-message">
          <h4>{isForeignKeyError ? 'Cannot Delete Item' : 'Error'}</h4>
          <p>{error}</p>

          {isForeignKeyError && showArchiveSuggestion && (
            <div className="error-toast-suggestions">
              <p>
                <strong>Suggestions:</strong>
              </p>
              <ul>
                <li>Check if any products are using this item</li>
                <li>Remove all references first</li>
                <li>Consider archiving instead of deleting</li>
              </ul>

              {onArchive && (
                <button className="archive-button" onClick={onArchive}>
                  Archive Instead
                </button>
              )}
            </div>
          )}
        </div>

        <button className="error-toast-close" onClick={onClose} aria-label="Close error message">
          ×
        </button>
      </div>
    </div>
  );
};

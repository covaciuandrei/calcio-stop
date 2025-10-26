import { useCallback, useState } from 'react';

interface ErrorToastState {
  error: string | null;
  type: 'error' | 'warning' | 'info';
  showArchiveSuggestion: boolean;
}

export const useErrorToast = () => {
  const [toastState, setToastState] = useState<ErrorToastState>({
    error: null,
    type: 'error',
    showArchiveSuggestion: false,
  });

  const showError = useCallback(
    (error: string, type: 'error' | 'warning' | 'info' = 'error', showArchiveSuggestion: boolean = false) => {
      setToastState({
        error,
        type,
        showArchiveSuggestion,
      });
    },
    []
  );

  const hideError = useCallback(() => {
    setToastState({
      error: null,
      type: 'error',
      showArchiveSuggestion: false,
    });
  }, []);

  const showForeignKeyError = useCallback(
    (entityType: string) => {
      showError(
        `Cannot delete this ${entityType} because it is being used by other items. Please remove all references first.`,
        'error',
        true
      );
    },
    [showError]
  );

  return {
    ...toastState,
    showError,
    hideError,
    showForeignKeyError,
  };
};

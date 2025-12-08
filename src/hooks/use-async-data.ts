import * as React from 'react';

interface UseAsyncDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  errorMessage: string = 'Failed to load data. Please refresh the page.'
): UseAsyncDataReturn<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchFn();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, isLoading };
}

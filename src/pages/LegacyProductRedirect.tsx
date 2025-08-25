import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWatchByModel, slugify } from '@/services/watchService';
import NotFound from './NotFound';

const LegacyProductRedirect = () => {
  const { model } = useParams<{ model: string }>();
  const navigate = useNavigate();

  const { data: watch, isLoading, error } = useQuery({
    queryKey: ['legacyWatch', model],
    queryFn: () => getWatchByModel(model!),
    enabled: !!model,
    retry: false,
  });

  useEffect(() => {
    if (watch) {
      const brandSlug = slugify(watch.brand);
      const modelSlug = slugify(watch.model);
      const encodedRef = encodeURIComponent(watch.reference);
      const newPath = `/watch/${brandSlug}/${modelSlug}/${encodedRef}`;
      navigate(newPath, { replace: true });
    }
  }, [watch, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error || !watch) {
    return <NotFound />;
  }

  return null;
};

export default LegacyProductRedirect;
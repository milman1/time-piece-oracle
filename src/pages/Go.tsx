import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Go = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const watchId = searchParams.get('watch_id');
    const sellerId = searchParams.get('seller_id');
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');

    if (!watchId || !sellerId) {
      window.location.href = '/';
      return;
    }

    // Build the edge function URL
    const redirectUrl = new URL('https://uvgizqmfjraopucphbli.supabase.co/functions/v1/affiliate-redirect');
    redirectUrl.searchParams.set('watch_id', watchId);
    redirectUrl.searchParams.set('seller_id', sellerId);
    
    if (utmSource) redirectUrl.searchParams.set('utm_source', utmSource);
    if (utmMedium) redirectUrl.searchParams.set('utm_medium', utmMedium);
    if (utmCampaign) redirectUrl.searchParams.set('utm_campaign', utmCampaign);

    // Redirect to the edge function
    window.location.href = redirectUrl.toString();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to seller...</p>
      </div>
    </div>
  );
};

export default Go;
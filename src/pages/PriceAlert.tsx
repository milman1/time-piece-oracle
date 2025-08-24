
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Shield, Mail, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Helmet } from 'react-helmet-async';

const PriceAlert = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    targetPrice: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Auto-fill email if user is authenticated
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user, formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.brand.trim()) {
      toast({
        title: "Brand Required",
        description: "Please enter a watch brand.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.model.trim()) {
      toast({
        title: "Model Required",
        description: "Please enter a watch model or reference number.",
        variant: "destructive"
      });
      return false;
    }
    
    const price = parseFloat(formData.targetPrice);
    if (!formData.targetPrice || isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid target price greater than 0.",
        variant: "destructive"
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('price_alerts')
        .insert([
          {
            brand: formData.brand.trim(),
            model: formData.model.trim(),
            target_price: parseFloat(formData.targetPrice),
            email: formData.email.trim()
          }
        ]);
      
      if (error) {
        console.error('Error inserting price alert:', error);
        toast({
          title: "Error",
          description: "Failed to create price alert. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Price alert created successfully:', formData);
      setIsSubmitted(true);
      
      toast({
        title: "Success!",
        description: "Your price alert has been created successfully.",
      });
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      targetPrice: '',
      email: ''
    });
    setIsSubmitted(false);
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Price Alerts | WatchPrices - Get Notified When Prices Drop</title>
        <meta name="description" content="Set up price alerts for luxury watches and get notified instantly when your target watch drops in price across major marketplaces." />
        <meta name="keywords" content="watch price alerts, luxury watch notifications, price tracking, watch deals" />
        <link rel="canonical" href={`${window.location.origin}/price-alert`} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-12 md:py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground mb-4">
            Set a Price Alert for Any Luxury Watch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 leading-relaxed">
            Get notified the moment your dream watch drops in price across major marketplaces.
          </p>

          {!isSubmitted ? (
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="brand" className="text-base font-medium">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      type="text"
                      placeholder="e.g., Rolex, Omega, Patek Philippe"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="h-12 text-lg"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="model" className="text-base font-medium">Model or Reference Number</Label>
                    <Input
                      id="model"
                      name="model"
                      type="text"
                      placeholder="e.g., Submariner, 116610LN"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="h-12 text-lg"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="targetPrice" className="text-base font-medium">Target Price (USD)</Label>
                    <Input
                      id="targetPrice"
                      name="targetPrice"
                      type="number"
                      placeholder="e.g., 8500"
                      value={formData.targetPrice}
                      onChange={handleInputChange}
                      className="h-12 text-lg"
                      required
                      min="1"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </div>

                   <div className="space-y-2 text-left">
                     <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                     <Input
                       id="email"
                       name="email"
                       type="email"
                       placeholder="your@email.com"
                       value={formData.email}
                       onChange={handleInputChange}
                       className="h-12 text-lg"
                       required
                       disabled={isLoading || !!user?.email}
                     />
                     {user?.email && (
                       <p className="text-sm text-muted-foreground">
                         Using your account email: {user.email}
                       </p>
                     )}
                   </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white mt-8"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Alert...
                      </>
                    ) : (
                      'Notify Me'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 shadow-lg bg-slate-50">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-medium text-foreground mb-2">
                    Alert Set Successfully!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    We'll notify you at <strong>{formData.email}</strong> when a {formData.brand} {formData.model} is listed below ${formData.targetPrice}.
                  </p>
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="mt-4"
                  >
                    Create Another Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trust Indicators */}
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>No Spam</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Used by Watch Collectors</span>
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
};

export default PriceAlert;

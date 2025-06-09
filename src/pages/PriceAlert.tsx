
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Shield, Mail, Users } from 'lucide-react';

const PriceAlert = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    targetPrice: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
            Set a Price Alert for Any Luxury Watch
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Get notified the moment your dream watch drops in price across major marketplaces.
          </p>

          {!isSubmitted ? (
            <Card className="border-2 shadow-lg">
              <CardContent className="p-8">
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
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white mt-8"
                  >
                    Notify Me
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 shadow-lg bg-slate-50">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-medium text-foreground mb-2">
                    Alert Set Successfully!
                  </h2>
                  <p className="text-muted-foreground">
                    We'll notify you at <strong>{formData.email}</strong> when a {formData.brand} {formData.model} is listed below ${formData.targetPrice}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
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
  );
};

export default PriceAlert;

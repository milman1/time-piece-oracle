import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Check, ArrowRight, BadgeDollarSign, Sparkles, ShieldCheck, Link as LinkIcon, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  businessName: z.string().min(2),
  website: z.string().url(),
  contactName: z.string().min(2),
  email: z.string().email(),
  marketplaces: z.string().optional(),       // e.g., "eBay, Chrono24, independent"
  region: z.string().optional(),             // e.g., "US, EU, Global"
  monthlyListings: z.string().optional(),    // e.g., "<50", "50–200", "200+"
  affiliateNetwork: z.string().optional(),   // Impact, CJ, ShareASale, In-house
  affiliateId: z.string().optional(),
  notes: z.string().optional(),
});
type AppForm = z.infer<typeof schema>;

export default function AffiliatePricing() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } , reset} = useForm<AppForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: AppForm) {
    // TODO: wire this to Supabase (seller_applications table) or your form backend
    // Example:
    // const { error } = await supabase.from("seller_applications").insert({ ...values, source: "pricing" });
    // if (error) throw error;
    console.log("Seller application:", values);
    setOpen(false);
    reset();
    alert("Thanks! We received your application. We'll be in touch shortly.");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Helmet>
        <title>Partner Pricing — Feature Your Watches | Time Piece Oracle</title>
        <meta
          name="description"
          content="Independent dealers: feature your inventory on Time Piece Oracle. Drive qualified buyers via our AI search, market analytics, and affiliate tracking."
        />
        <meta property="og:title" content="Partner Pricing — Feature Your Watches" />
        <meta property="og:description" content="Join our trusted network. Increase exposure, track clicks, and reach buyers ready to purchase." />
      </Helmet>

      {/* Hero */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="rounded-full">For Sellers</Badge>
          <span className="text-sm text-muted-foreground">Independent dealers & shops</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
          Get Your Watches Featured on <span className="font-semibold">Time Piece Oracle</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tap into high-intent buyers searching across brands and references. We support direct listings and affiliate programs.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                Apply to Partner <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Partner Application</DialogTitle>
                <DialogDescription>
                  Tell us about your business. We'll respond within 1–2 business days.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Business name</Label>
                    <Input {...register("businessName")} placeholder="Acme Watch Co." />
                    {errors.businessName && <p className="text-sm text-red-500 mt-1">Please enter a valid business name</p>}
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input {...register("website")} placeholder="https://example.com" />
                    {errors.website && <p className="text-sm text-red-500 mt-1">Enter a valid URL</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Contact name</Label>
                    <Input {...register("contactName")} placeholder="Jane Doe" />
                    {errors.contactName && <p className="text-sm text-red-500 mt-1">Enter a contact name</p>}
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" {...register("email")} placeholder="you@company.com" />
                    {errors.email && <p className="text-sm text-red-500 mt-1">Enter a valid email</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Marketplaces (optional)</Label>
                    <Input {...register("marketplaces")} placeholder="eBay, Chrono24, in‑house" />
                  </div>
                  <div>
                    <Label>Region (optional)</Label>
                    <Input {...register("region")} placeholder="US, EU, Global" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Monthly listings (optional)</Label>
                    <Input {...register("monthlyListings")} placeholder="<50, 50–200, 200+" />
                  </div>
                  <div>
                    <Label>Affiliate network (optional)</Label>
                    <Input {...register("affiliateNetwork")} placeholder="Impact, CJ, ShareASale, In‑house" />
                  </div>
                </div>

                <div>
                  <Label>Affiliate ID (optional)</Label>
                  <Input {...register("affiliateId")} placeholder="Your program partner ID" />
                </div>

                <div>
                  <Label>Notes (optional)</Label>
                  <Textarea {...register("notes")} placeholder="Anything else we should know?" />
                </div>

                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="lg" asChild>
            <a href="mailto:partners@timepieceoracle.com?subject=Affiliate%20Partner%20Inquiry">Contact sales</a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          We may earn a commission when buyers purchase via affiliate links.
        </p>
      </section>

      {/* Plans */}
      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <Badge className="mb-3 w-fit">Starter</Badge>
          <h3 className="text-2xl font-semibold mb-2">Affiliate Partner</h3>
          <p className="text-muted-foreground mb-4">Free to join • Pay only on conversions via your affiliate program.</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Feature your listings (affiliate links)</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Trusted Seller badge (verification required)</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Click & conversion tracking</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Seller profile & logo</li>
          </ul>
          <div className="mt-6">
            <Button className="w-full" onClick={() => setOpen(true)}>Apply</Button>
          </div>
        </Card>

        <Card className="p-6 border-primary">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="w-fit" variant="secondary">Recommended</Badge>
            <BadgeDollarSign className="h-4 w-4" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Featured Seller</h3>
          <p className="text-muted-foreground mb-2">
            <span className="text-3xl font-bold">$39</span><span className="text-sm">/month</span> + affiliate program
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Priority placement in search</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Enhanced verification & trust markers</li>
            <li className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Custom UTM & deep-link support</li>
            <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Seller analytics dashboard</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Early access to new buyer tools</li>
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button className="w-full" onClick={() => setOpen(true)}>Start application</Button>
            <Button variant="outline" className="w-full" asChild>
              <a href="/pricing">Compare buyer plans</a>
            </Button>
          </div>
        </Card>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How featuring works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card><CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">1. Connect</p>
            <p className="text-sm">Share your feed (CSV/API/RSS) or affiliate links. We verify your shop and import listings.</p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">2. Feature</p>
            <p className="text-sm">Your watches appear in AI-powered search with trust badges and direct outbound links.</p>
          </CardContent></Card>
          <Card><CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-2">3. Track</p>
            <p className="text-sm">See clicks and conversions via your affiliate program; upgrade for analytics.</p>
          </CardContent></Card>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Do I need an affiliate program?</p>
            <p className="text-muted-foreground">It helps for payouts and tracking, but we can support direct links while we set you up.</p>
          </div>
          <div>
            <p className="font-medium">What feeds do you accept?</p>
            <p className="text-muted-foreground">CSV, JSON API, RSS/Atom, or marketplace exports. We'll share a template after approval.</p>
          </div>
          <div>
            <p className="font-medium">Are there listing limits?</p>
            <p className="text-muted-foreground">No hard cap. Featured Sellers get faster ingestion and priority surfacing.</p>
          </div>
          <div>
            <p className="font-medium">Is there a contract?</p>
            <p className="text-muted-foreground">Month‑to‑month. Cancel anytime from your dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
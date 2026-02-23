
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Check, Loader2 } from 'lucide-react';

interface EmailCaptureProps {
    source?: string;
    heading?: string;
    description?: string;
}

const EmailCapture: React.FC<EmailCaptureProps> = ({
    source = 'blog',
    heading = 'Get the full report in your inbox',
    description = 'Enter your email to receive our curated summary with key data points every collector should know.',
}) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setStatus('loading');
        setErrorMsg('');

        try {
            const { error } = await supabase.functions.invoke('newsletter-subscribe', {
                body: { email, source },
            });

            if (error) throw error;
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err?.message || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200/50 p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <Check className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-[16px] font-semibold text-foreground mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    You're in!
                </h3>
                <p className="text-[13px] text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Check your inbox — we've sent the report summary to <strong>{email}</strong>.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100/60 p-6">
            <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-[var(--gold)]" />
                <h3 className="text-[16px] font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {heading}
                </h3>
            </div>
            <p className="text-[13px] text-muted-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                {description}
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 min-w-0 px-3.5 py-2.5 text-[13px] bg-[var(--warm-50)] border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2.5 btn-navy text-white text-[13px] font-medium rounded-xl transition-all duration-300 hover:opacity-90 disabled:opacity-60 shrink-0 flex items-center gap-1.5"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    {status === 'loading' ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</>
                    ) : (
                        'Get Report'
                    )}
                </button>
            </form>

            {status === 'error' && (
                <p className="text-[12px] text-red-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {errorMsg}
                </p>
            )}

            <p className="text-[11px] text-muted-foreground/50 mt-2.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                No spam, ever. Unsubscribe anytime.
            </p>
        </div>
    );
};

export default EmailCapture;

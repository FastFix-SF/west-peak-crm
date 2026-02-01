import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Phone } from 'lucide-react';

type Step = 'phone' | 'verify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('1')) {
      digits = digits.slice(1);
    }
    if (digits.length === 0) {
      return '+1 ';
    }
    if (digits.length <= 3) {
      return `+1 (${digits}`;
    } else if (digits.length <= 6) {
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('+1')) {
      value = '+1 ';
    }
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
  };

  const getE164Phone = (formattedPhone: string) => {
    const digits = formattedPhone.replace(/\D/g, '');
    return `+${digits}`;
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check both admin_users and team_directory for admin/owner status
        const [{ data: adminUser }, { data: teamMember }] = await Promise.all([
          supabase
            .from('admin_users')
            .select('is_active')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .maybeSingle(),
          supabase
            .from('team_directory')
            .select('role, status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .maybeSingle()
        ]);

        const isAdmin = !!adminUser || teamMember?.role === 'admin';
        const isOwner = teamMember?.role === 'owner';

        if (isAdmin || isOwner) {
          navigate('/admin');
        }
      }
    };

    checkSession();
  }, [navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const e164Phone = getE164Phone(phone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164Phone,
      });

      if (error) throw error;

      setStep('verify');
      toast({
        title: 'Code sent!',
        description: 'Check your phone for the verification code.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send verification code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const e164Phone = getE164Phone(phone);
      
      const { data: authData, error } = await supabase.auth.verifyOtp({
        phone: e164Phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      if (authData.user) {
        // Check admin status
        const { data: adminCheck } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', authData.user.id)
          .eq('is_active', true)
          .maybeSingle();

        const { data: teamCheck } = await supabase
          .from('team_directory')
          .select('role, status')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        const isAdmin = !!adminCheck;
        const isOwner = teamCheck?.role === 'owner';

        if (!isAdmin && !isOwner) {
          await supabase.auth.signOut();
          toast({
            title: 'Access denied',
            description: 'You do not have permission to access the admin dashboard.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        toast({
          title: 'Welcome!',
          description: 'Successfully signed in to admin dashboard.',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid verification code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {step === 'phone' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
            <p className="text-center text-muted-foreground mb-6 text-sm">
              Enter your phone number to sign in
            </p>
            
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone || '+1 '}
                  onChange={handlePhoneChange}
                  maxLength={18}
                  required
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +1 for US)
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-medium" 
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          </>
        )}

        {step === 'verify' && (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Verify Code</h1>
            <p className="text-center text-muted-foreground mb-6 text-sm">
              Enter the 6-digit code sent to your phone
            </p>
            
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Verification Code</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="h-12 text-center tracking-widest text-2xl font-semibold"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-medium" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full h-12 font-medium"
              >
                Resend Code
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                }}
                className="w-full font-medium"
              >
                Back
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminLogin;

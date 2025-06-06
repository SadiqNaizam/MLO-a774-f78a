import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavigationMenu from '@/components/layout/BottomNavigationMenu';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, CheckCircle } from 'lucide-react';

const paymentDetailsSchema = z.object({
  sourceAccount: z.string().min(1, "Please select a source account."),
  payeeName: z.string().min(2, "Payee name is required."),
  payeeAccount: z.string().regex(/^\d{8,12}$/, "Invalid account number (must be 8-12 digits)."),
  amount: z.coerce.number().positive("Amount must be positive."),
  reference: z.string().optional(),
});

type PaymentDetailsFormValues = z.infer<typeof paymentDetailsSchema>;

const PaymentInitiationPage = () => {
  console.log('PaymentInitiationPage loaded');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Details, 2: OTP, 3: Confirmation
  const [otpValue, setOtpValue] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentDetailsFormValues | null>(null);

  const paymentForm = useForm<PaymentDetailsFormValues>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      sourceAccount: '',
      payeeName: '',
      payeeAccount: '',
      amount: 0,
      reference: '',
    },
  });

  const handlePaymentSubmit = (data: PaymentDetailsFormValues) => {
    console.log('Payment details submitted:', data);
    setPaymentData(data);
    // Simulate sending OTP
    toast({ title: "OTP Sent", description: "An OTP has been sent to your registered device." });
    setCurrentStep(2);
  };

  const handleOtpSubmit = () => {
    console.log('OTP submitted:', otpValue);
    if (otpValue === '123456') { // Simulate correct OTP
      // Simulate payment processing
      toast({ title: "Payment Processing", description: "Your payment is being processed..." });
      setTimeout(() => {
        setCurrentStep(3); // Move to confirmation screen
      }, 2000);
    } else {
      toast({ title: "Invalid OTP", description: "The OTP you entered is incorrect. Please try again.", variant: "destructive" });
      setOtpValue('');
    }
  };
  
  const handleGoBack = () => {
    if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
        setOtpValue(''); // Clear OTP if going back from OTP step
    } else {
        navigate(-1); // Go to previous page in history
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="Make a Payment" />
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {/* Step 1: Payment Details */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                  <FormField
                    control={paymentForm.control}
                    name="sourceAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="acc_123_primary">My Main Account (Balance: $12,530.75)</SelectItem>
                            <SelectItem value="acc_789_savings">Savings Account (Balance: $8,200.00)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="payeeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="payeeAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Account Number</FormLabel>
                        <FormControl><Input placeholder="Enter 8-12 digit account number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Rent for July" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full bg-primary-action hover:bg-primary-action/90 text-primary-foreground">
                    Continue to Verification
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && paymentData && (
          <Card>
            <CardHeader>
              <CardTitle>Verify Payment</CardTitle>
              <FormDescription>
                Enter the 6-digit OTP sent to your registered device to confirm payment of 
                ${paymentData.amount.toFixed(2)} to {paymentData.payeeName}.
              </FormDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <InputOTP maxLength={6} value={otpValue} onChange={(value) => setOtpValue(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button onClick={handleOtpSubmit} size="lg" className="w-full max-w-xs">
                Verify & Pay
              </Button>
              <Button variant="link" onClick={() => toast({ title: "OTP Resent (Simulated)", description: "A new OTP has been sent." })}>
                Resend OTP
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Step 3: Confirmation */}
        {currentStep === 3 && paymentData && (
          <Card className="text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              <CardTitle className="mt-4 text-2xl">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-lg">
                You have successfully sent <strong>${paymentData.amount.toFixed(2)}</strong> to <strong>{paymentData.payeeName}</strong>.
              </p>
              <p className="text-muted-foreground">
                Account: {paymentData.payeeAccount}
              </p>
              {paymentData.reference && <p className="text-muted-foreground">Reference: {paymentData.reference}</p>}
              <p className="text-sm text-muted-foreground">Transaction ID: PMT{Date.now()}</p>
            </CardContent>
            <div className="p-6">
                <Button onClick={() => navigate('/dashboard')} size="lg" className="w-full bg-primary-action hover:bg-primary-action/90 text-primary-foreground">
                    Back to Dashboard
                </Button>
            </div>
          </Card>
        )}

      </main>
      <BottomNavigationMenu />
    </div>
  );
};

export default PaymentInitiationPage;
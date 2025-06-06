import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavigationMenu from '@/components/layout/BottomNavigationMenu';
import JointAccountInvitationStatusIndicator from '@/components/JointAccountInvitationStatusIndicator';
import PermissionSettingRow from '@/components/PermissionSettingRow';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast" // Assuming useToast is set up

type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'error';

const invitePartnerSchema = z.object({
  partnerEmail: z.string().email({ message: "Invalid email address." }),
});

type InvitePartnerFormValues = z.infer<typeof invitePartnerSchema>;

interface Permission {
  id: string;
  label: string;
  description?: string;
  isEnabled: boolean;
  hasNumericInput?: boolean;
  numericInputValue?: number;
  numericInputLabel?: string;
}

const initialPermissions: Permission[] = [
  { id: 'full_access', label: 'Full Account Access', description: 'Can view, transact, and manage account settings.', isEnabled: true },
  { id: 'view_only', label: 'View Only Access', description: 'Can only view account balance and transactions.', isEnabled: false },
  { id: 'spending_limit', label: 'Set Spending Limit', description: 'Define a maximum daily spending limit for this partner.', isEnabled: false, hasNumericInput: true, numericInputValue: 100, numericInputLabel: 'Daily Limit (USD)' },
];


const JointAccountSetupFlowPage = () => {
  console.log('JointAccountSetupFlowPage loaded');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus | null>(null);
  const [invitedPartnerEmail, setInvitedPartnerEmail] = useState<string>('');
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const totalSteps = 4;
  const progressValue = (currentStep / totalSteps) * 100;

  const inviteForm = useForm<InvitePartnerFormValues>({
    resolver: zodResolver(invitePartnerSchema),
    defaultValues: { partnerEmail: '' },
  });

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  // const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1)); // Not used in this simplified flow

  const handleInvitePartner = (data: InvitePartnerFormValues) => {
    console.log('Inviting partner:', data.partnerEmail);
    setInvitedPartnerEmail(data.partnerEmail);
    // Simulate API call for invitation
    setTimeout(() => {
      setInvitationStatus('pending');
      toast({ title: "Invitation Sent!", description: `An invitation has been sent to ${data.partnerEmail}.` });
      // Simulate partner acceptance for demo purposes
      setTimeout(() => {
        setInvitationStatus('accepted');
        toast({ title: "Partner Accepted!", description: `${data.partnerEmail} has accepted your invitation.` });
        handleNextStep(); // Move to permission setting
      }, 3000);
    }, 1500);
  };

  const handlePermissionToggle = (id: string, enabled: boolean) => {
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, isEnabled: enabled } : p));
  };
  const handleNumericPermissionChange = (id: string, value: number) => {
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, numericInputValue: value } : p));
  };

  const handleConfirmSettings = () => {
    console.log('Permissions confirmed:', permissions);
    handleNextStep(); // Move to review step
  };
  
  const handleCreateJointAccount = () => {
    console.log('Creating joint account with settings:', { invitedPartnerEmail, permissions });
    setShowConfirmationDialog(true);
  };

  const closeConfirmationDialogAndNavigate = () => {
    setShowConfirmationDialog(false);
    toast({ title: "Joint Account Created!", description: "Your new joint account is ready.", className: "bg-green-500 text-white" });
    navigate('/dashboard'); // Navigate to dashboard after creation
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="Setup Joint Account" />
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
        <Progress value={progressValue} className="w-full mb-6" />

        {/* Step 1: Introduction */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Open a Joint Account</CardTitle>
              <CardDescription>Share finances seamlessly and securely with a partner. Get started in a few simple steps.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Benefits include:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
                <li>Combined financial power for shared goals.</li>
                <li>Transparent tracking of joint expenses.</li>
                <li>Customizable permissions for each account holder.</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextStep} size="lg" className="w-full bg-primary-action hover:bg-primary-action/90 text-primary-foreground">
                Get Started
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Invite Partner */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Invite Your Partner</CardTitle>
              <CardDescription>Enter the email address of the person you want to share this account with.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...inviteForm}>
                <form onSubmit={inviteForm.handleSubmit(handleInvitePartner)} className="space-y-4">
                  <FormField
                    control={inviteForm.control}
                    name="partnerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner's Email</FormLabel>
                        <FormControl>
                          <Input placeholder="partner@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={inviteForm.formState.isSubmitting}>
                    {inviteForm.formState.isSubmitting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </form>
              </Form>
              {invitationStatus && invitedPartnerEmail && (
                <div className="mt-6">
                  <JointAccountInvitationStatusIndicator status={invitationStatus} partnerName={invitedPartnerEmail} />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Set Permissions (shown after partner accepts) */}
        {currentStep === 3 && invitationStatus === 'accepted' && (
           <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Set Permissions for {invitedPartnerEmail}</CardTitle>
              <CardDescription>Define what your partner can do with the joint account. You will have full admin rights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {permissions.map(permission => (
                <PermissionSettingRow
                  key={permission.id}
                  id={permission.id}
                  label={permission.label}
                  description={permission.description}
                  isEnabled={permission.isEnabled}
                  onToggle={handlePermissionToggle}
                  hasNumericInput={permission.hasNumericInput}
                  numericInputValue={permission.numericInputValue}
                  onNumericInputChange={handleNumericPermissionChange}
                  numericInputLabel={permission.numericInputLabel}
                />
              ))}
            </CardContent>
            <CardFooter>
                <Button onClick={handleConfirmSettings} size="lg" className="w-full">
                    Confirm Permissions & Continue
                </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Review and Confirm</CardTitle>
              <CardDescription>Please review the details for your new joint account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Partner:</h3>
                <p className="text-muted-foreground">{invitedPartnerEmail}</p>
              </div>
              <div>
                <h3 className="font-semibold">Permissions for Partner:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {permissions.filter(p => p.isEnabled).map(p => (
                    <li key={p.id}>
                      {p.label}
                      {p.hasNumericInput && p.numericInputValue !== undefined && ` (Limit: $${p.numericInputValue})`}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                By creating this joint account, you agree to our terms and conditions.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateJointAccount} size="lg" className="w-full bg-primary-action hover:bg-primary-action/90 text-primary-foreground">
                Create Joint Account
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <BottomNavigationMenu />

      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Joint Account Created Successfully!</DialogTitle>
            <DialogDescription>
              Your new joint account with {invitedPartnerEmail} has been set up. You can now manage it from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeConfirmationDialogAndNavigate} className="bg-primary-action hover:bg-primary-action/90 text-primary-foreground">
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JointAccountSetupFlowPage;
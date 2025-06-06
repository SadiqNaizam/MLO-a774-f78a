import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavigationMenu from '@/components/layout/BottomNavigationMenu';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import InteractiveTransactionRow, { Transaction } from '@/components/InteractiveTransactionRow';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ArrowRightLeft, Settings, CreditCard } from 'lucide-react';

// Placeholder data
const sampleAccount = {
  accountId: 'acc_123_primary',
  accountType: 'Checking Account',
  accountName: 'My Main Account',
  balance: 12530.75,
  currency: 'USD',
  accountNumber: '**** **** **** 1234',
  sortCode: '00-11-22',
};

const sampleTransactions: Transaction[] = [
  { id: 'txn_1', date: new Date(2024, 6, 20), description: 'Grocery Store Purchase', amount: 75.50, type: 'debit', category: 'Groceries' },
  { id: 'txn_2', date: new Date(2024, 6, 19), description: 'Salary Deposit', amount: 2500.00, type: 'credit', category: 'Income' },
  { id: 'txn_3', date: new Date(2024, 6, 18), description: 'Online Subscription', amount: 12.99, type: 'debit', category: 'Entertainment' },
  { id: 'txn_4', date: new Date(2024, 6, 17), description: 'Pending - Cafe Purchase', amount: 5.20, type: 'pending', category: 'Food' },
  { id: 'txn_5', date: new Date(2024, 6, 15), description: 'ATM Withdrawal', amount: 100.00, type: 'debit', category: 'Cash' },
];

const AccountDetailsPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  console.log(`AccountDetailsPage loaded for accountId: ${accountId}`);
  const navigate = useNavigate();

  // In a real app, fetch account details based on accountId
  const currentAccount = sampleAccount; // Using sample data

  const handleTransactionClick = (transactionId: string) => {
    console.log(`Transaction ${transactionId} clicked`);
    // Potentially navigate to a detailed transaction view or show a modal
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="Account Details" />
      <ScrollArea className="flex-grow pb-20 md:pb-8">
        <main className="container mx-auto px-4 py-6 space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('/dashboard')}>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentAccount.accountName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <AccountSummaryCard
            {...currentAccount}
            onViewDetailsClick={() => { /* Already on details, or could show more info */ }}
          />

          <div className="flex space-x-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline"><ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer/Pay</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Initiate Transfer/Payment</DialogTitle>
                        <DialogDescription>
                            Select an option to proceed. This is a placeholder.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => navigate('/payment')}>Make a Payment</Button>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Manage Account</Button>
             <Button variant="outline"><CreditCard className="mr-2 h-4 w-4" /> Manage Cards</Button>
          </div>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="details">Account Info</TabsTrigger>
              <TabsTrigger value="settings" className="hidden md:inline-flex">Settings</TabsTrigger> {/* Example additional tab */}
            </TabsList>
            <TabsContent value="transactions" className="mt-4">
              <div className="space-y-2">
                {sampleTransactions.map((tx) => (
                  <InteractiveTransactionRow
                    key={tx.id}
                    transaction={tx}
                    onRowClick={handleTransactionClick}
                  />
                ))}
                {sampleTransactions.length === 0 && <p className="text-muted-foreground">No transactions yet.</p>}
              </div>
                <Button variant="link" className="mt-4" onClick={() => navigate(`/transaction-history?accountId=${accountId}`)}>
                View Full History
              </Button>
            </TabsContent>
            <TabsContent value="details" className="mt-4 p-4 border rounded-md bg-card text-card-foreground">
              <h3 className="text-lg font-semibold mb-2">Account Information</h3>
              <p><strong>Account Number:</strong> {currentAccount.accountNumber}</p>
              <p><strong>Sort Code:</strong> {currentAccount.sortCode}</p>
              <p><strong>Currency:</strong> {currentAccount.currency}</p>
              {/* Add more details as needed */}
            </TabsContent>
            <TabsContent value="settings" className="mt-4 p-4 border rounded-md bg-card text-card-foreground">
              <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
              <p className="text-muted-foreground">Placeholder for account-specific settings (e.g., statements, alerts).</p>
            </TabsContent>
          </Tabs>
        </main>
      </ScrollArea>
      <BottomNavigationMenu />
    </div>
  );
};

export default AccountDetailsPage;
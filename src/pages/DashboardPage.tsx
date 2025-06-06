import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavigationMenu from '@/components/layout/BottomNavigationMenu';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import AnimatedFinancialDataChart from '@/components/AnimatedFinancialDataChart';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';

// Placeholder data
const placeholderAccount1 = {
  accountId: 'acc_123_primary',
  accountType: 'Checking Account',
  accountName: 'My Main Account',
  balance: 12530.75,
  currency: 'USD',
};

const placeholderAccount2 = {
  accountId: 'acc_456_joint',
  accountType: 'Joint Savings Account',
  accountName: 'Family Savings',
  balance: 5820.50,
  currency: 'USD',
  isJointAccount: true,
  jointAccountHolder: 'Jane Partner',
};

const placeholderChartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const DashboardPage = () => {
  console.log('DashboardPage loaded');
  const navigate = useNavigate();

  const handleViewDetails = (accountId: string) => {
    navigate(`/account-details/${accountId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="Dashboard" />
      <ScrollArea className="flex-grow pb-20 md:pb-8"> {/* Padding bottom for BottomNavMenu */}
        <main className="container mx-auto px-4 py-6 space-y-8">
          {/* Account Summaries Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Your Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AccountSummaryCard {...placeholderAccount1} onViewDetailsClick={handleViewDetails} />
              <AccountSummaryCard {...placeholderAccount2} onViewDetailsClick={handleViewDetails} />
            </div>
          </section>

          {/* Quick Actions Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Button variant="outline" size="lg" onClick={() => navigate('/payment')}>
                Make a Payment
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/transfer')}> {/* Placeholder link */}
                Transfer Money
              </Button>
              <Button 
                size="lg" 
                onClick={() => navigate('/joint-account-setup')}
                className="bg-primary-action hover:bg-primary-action/90 text-primary-foreground"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Open Joint Account
              </Button>
            </div>
          </section>

          {/* Financial Overview/Chart Section */}
          <section>
            <AnimatedFinancialDataChart
              data={placeholderChartData}
              title="Spending Overview (Last 6 Months)"
              showArea={true}
              areaColor="#0051B4"
              lineColor="#003E8A"
            />
          </section>

          {/* Placeholder for Recent Transactions or other widgets */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Recent Activity</h2>
            <div className="p-6 border rounded-lg bg-card text-card-foreground">
              <p className="text-muted-foreground">Your latest transactions will appear here.</p>
              <Button variant="link" onClick={() => navigate('/transaction-history')} className="px-0">View all transactions</Button>
            </div>
          </section>
        </main>
      </ScrollArea>
      <BottomNavigationMenu />
    </div>
  );
};

export default DashboardPage;
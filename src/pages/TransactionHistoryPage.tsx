import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavigationMenu from '@/components/layout/BottomNavigationMenu';
import InteractiveTransactionRow, { Transaction } from '@/components/InteractiveTransactionRow';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge'; // Though InteractiveTransactionRow handles its own badges.
import { Search, Filter } from 'lucide-react';

const allTransactions: Transaction[] = [
  { id: 'txn_101', date: new Date(2024, 6, 25), description: 'Amazon Purchase', amount: 49.99, type: 'debit', category: 'Shopping' },
  { id: 'txn_102', date: new Date(2024, 6, 24), description: 'Paycheck Deposit', amount: 1800.00, type: 'credit', category: 'Income' },
  { id: 'txn_103', date: new Date(2024, 6, 23), description: 'Restaurant - The Grill', amount: 65.20, type: 'debit', category: 'Food' },
  { id: 'txn_104', date: new Date(2024, 6, 22), description: 'Utility Bill - Electricity', amount: 85.00, type: 'debit', category: 'Bills' },
  { id: 'txn_105', date: new Date(2024, 6, 21), description: 'Spotify Subscription', amount: 10.99, type: 'debit', category: 'Entertainment' },
  { id: 'txn_106', date: new Date(2024, 6, 20), description: 'Transfer from Savings', amount: 200.00, type: 'credit', category: 'Transfers' },
  { id: 'txn_107', date: new Date(2024, 5, 15), description: 'Coffee Shop', amount: 4.75, type: 'debit', category: 'Food' },
  { id: 'txn_108', date: new Date(2024, 5, 10), description: 'Book Store', amount: 22.50, type: 'debit', category: 'Shopping' },
  { id: 'txn_109', date: new Date(2024, 4, 30), description: 'Birthday Gift Received', amount: 50.00, type: 'credit', category: 'Gifts' },
];

const TransactionHistoryPage = () => {
  console.log('TransactionHistoryPage loaded');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accountId = queryParams.get('accountId'); // Example: to show transactions for a specific account

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit' | 'pending'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const uniqueCategories = useMemo(() => {
    const categories = new Set(allTransactions.map(tx => tx.category).filter(Boolean) as string[]);
    return ['all', ...Array.from(categories)];
  }, []);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tx.category && tx.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || tx.type === filterType;
      const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
      // Add accountId filter if needed: && (accountId ? tx.accountId === accountId : true)
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, filterType, filterCategory /*, accountId */]);

  const handleTransactionClick = (transactionId: string) => {
    console.log(`Transaction ${transactionId} clicked on history page`);
    // Could open a modal with more details
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title={accountId ? `History for Account ${accountId.slice(-4)}` : "Transaction History"} />
      <main className="flex-grow container mx-auto px-4 py-6 space-y-6 pb-20 md:pb-8">
        <div className="space-y-4 p-4 border rounded-lg bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions by description or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filter-type" className="text-sm font-medium text-muted-foreground block mb-1">Filter by Type</label>
              <Select value={filterType} onValueChange={(value: 'all' | 'debit' | 'credit' | 'pending') => setFilterType(value)}>
                <SelectTrigger id="filter-type">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground inline-block" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="filter-category" className="text-sm font-medium text-muted-foreground block mb-1">Filter by Category</label>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
                <SelectTrigger id="filter-category">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground inline-block" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-250px)] border rounded-lg"> {/* Adjust height as needed */}
          <div className="p-1">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <InteractiveTransactionRow
                  key={tx.id}
                  transaction={tx}
                  onRowClick={handleTransactionClick}
                />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <p className="text-lg">No transactions found.</p>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
      <BottomNavigationMenu />
    </div>
  );
};

export default TransactionHistoryPage;
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, AlertCircle } from 'lucide-react'; // Icons for transaction type

interface Transaction {
  id: string;
  date: Date | string;
  description: string;
  amount: number;
  currency?: string;
  type: 'debit' | 'credit' | 'pending' | 'failed'; // Example types
  category?: string;
}

interface InteractiveTransactionRowProps {
  transaction: Transaction;
  onRowClick?: (transactionId: string) => void;
}

const getTransactionTypeAttributes = (type: Transaction['type']) => {
  switch (type) {
    case 'credit':
      return { Icon: ArrowDownLeft, color: 'text-green-600', badgeVariant: 'default', badgeText: 'Credit' } as const;
    case 'debit':
      return { Icon: ArrowUpRight, color: 'text-red-600', badgeVariant: 'destructive', badgeText: 'Debit' } as const;
    case 'pending':
      return { Icon: AlertCircle, color: 'text-yellow-500', badgeVariant: 'outline', badgeText: 'Pending' } as const;
    case 'failed':
      return { Icon: AlertCircle, color: 'text-red-700', badgeVariant: 'destructive', badgeText: 'Failed' } as const;
    default:
      return { Icon: AlertCircle, color: 'text-gray-500', badgeVariant: 'secondary', badgeText: 'Unknown' } as const;
  }
};

const InteractiveTransactionRow: React.FC<InteractiveTransactionRowProps> = ({
  transaction,
  onRowClick,
}) => {
  console.log("Rendering InteractiveTransactionRow for transaction:", transaction.id);
  const { Icon, color, badgeVariant, badgeText } = getTransactionTypeAttributes(transaction.type);
  const formattedDate = typeof transaction.date === 'string' ? format(new Date(transaction.date), 'MMM dd, yyyy') : format(transaction.date, 'MMM dd, yyyy');
  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: transaction.currency || 'USD',
    signDisplay: 'never' // We handle sign with icon/color
  }).format(Math.abs(transaction.amount));

  return (
    <div
      className={`flex items-center p-3 hover:bg-accent transition-colors rounded-md ${onRowClick ? 'cursor-pointer' : ''}`}
      onClick={() => onRowClick?.(transaction.id)}
      role={onRowClick ? 'button' : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      onKeyDown={onRowClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onRowClick(transaction.id) : undefined}
    >
      <div className={`mr-3 p-2 rounded-full bg-muted ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-sm">{transaction.description}</p>
        <p className="text-xs text-muted-foreground">{formattedDate}</p>
      </div>
      <div className="text-right">
        <p className={`font-semibold text-sm ${color}`}>
          {transaction.type === 'credit' ? '+' : transaction.type === 'debit' ? '-' : ''}{formattedAmount}
        </p>
        {transaction.category && <Badge variant="secondary" className="mt-1 text-xs">{transaction.category}</Badge>}
        {/* <Badge variant={badgeVariant} className="mt-1 text-xs">{badgeText}</Badge> */}
      </div>
    </div>
  );
};
export default InteractiveTransactionRow;
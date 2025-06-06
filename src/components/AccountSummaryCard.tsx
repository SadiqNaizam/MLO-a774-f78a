import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface AccountSummaryCardProps {
  accountId: string;
  accountType: string;
  accountName: string;
  balance: number;
  currency?: string;
  onViewDetailsClick: (accountId: string) => void;
  // Example: For joint account specific display
  isJointAccount?: boolean;
  jointAccountHolder?: string;
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  accountId,
  accountType,
  accountName,
  balance,
  currency = 'USD',
  onViewDetailsClick,
  isJointAccount,
  jointAccountHolder,
}) => {
  console.log("Rendering AccountSummaryCard for account:", accountName);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">{accountName}</CardTitle>
        <CardDescription>
          {accountType}
          {isJointAccount && jointAccountHolder && (
            <span className="block text-xs text-muted-foreground">Shared with {jointAccountHolder}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-3xl font-bold">
          {new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(balance)}
        </p>
        {/* Additional details can be added here e.g. last transaction, pending transactions */}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onViewDetailsClick(accountId)}>
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
export default AccountSummaryCard;
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Hourglass } from 'lucide-react';

type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'error';

interface JointAccountInvitationStatusIndicatorProps {
  status: InvitationStatus;
  partnerName?: string; // Optional: to display partner's name
}

const statusConfig = {
  pending: {
    Icon: Hourglass,
    text: (name?: string) => `Invitation sent to ${name || 'partner'}. Pending acceptance.`,
    variant: 'outline',
    colorClass: 'text-yellow-600 border-yellow-500',
  },
  accepted: {
    Icon: CheckCircle2,
    text: (name?: string) => `${name || 'Partner'} has accepted the invitation.`,
    variant: 'default',
    colorClass: 'bg-green-100 text-green-700 border-green-500',
  },
  declined: {
    Icon: XCircle,
    text: (name?: string) => `${name || 'Partner'} has declined the invitation.`,
    variant: 'destructive',
    colorClass: 'bg-red-100 text-red-700 border-red-500',
  },
  expired: {
    Icon: AlertCircle,
    text: () => 'This invitation has expired.',
    variant: 'outline',
    colorClass: 'text-gray-600 border-gray-500',
  },
  error: {
    Icon: AlertCircle,
    text: () => 'There was an error with the invitation status.',
    variant: 'destructive',
    colorClass: 'bg-red-100 text-red-700 border-red-500',
  },
} as const;


const JointAccountInvitationStatusIndicator: React.FC<JointAccountInvitationStatusIndicatorProps> = ({
  status,
  partnerName,
}) => {
  console.log("Rendering JointAccountInvitationStatusIndicator with status:", status);
  const config = statusConfig[status] || statusConfig.error;

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-md border ${config.colorClass} bg-opacity-50`}>
      <config.Icon className={`h-5 w-5 ${config.colorClass.split(' ')[0]}`} /> {/* Use only text color for icon */}
      <p className="text-sm">{config.text(partnerName)}</p>
    </div>
  );
};
export default JointAccountInvitationStatusIndicator;
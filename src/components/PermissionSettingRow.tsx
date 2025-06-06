import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input"; // For spending limits, etc.
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface PermissionSettingRowProps {
  id: string;
  label: string;
  description?: string;
  tooltip?: string;
  isEnabled: boolean;
  onToggle: (id: string, enabled: boolean) => void;
  // Optional: For settings that require an input value, like spending limit
  hasNumericInput?: boolean;
  numericInputValue?: number;
  onNumericInputChange?: (id: string, value: number) => void;
  numericInputLabel?: string;
  numericInputPlaceholder?: string;
  disabled?: boolean;
}

const PermissionSettingRow: React.FC<PermissionSettingRowProps> = ({
  id,
  label,
  description,
  tooltip,
  isEnabled,
  onToggle,
  hasNumericInput,
  numericInputValue,
  onNumericInputChange,
  numericInputLabel,
  numericInputPlaceholder = "Enter amount",
  disabled = false,
}) => {
  console.log("Rendering PermissionSettingRow for:", label, "Enabled:", isEnabled);

  const handleToggle = (checked: boolean) => {
    onToggle(id, checked);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onNumericInputChange) {
      const value = event.target.value === '' ? undefined : parseFloat(event.target.value);
      if(value !== undefined && !isNaN(value)) {
        onNumericInputChange(id, value);
      } else if (event.target.value === '') {
         onNumericInputChange(id, 0); // Or handle as needed
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 p-4 border rounded-md">
      <div className="flex-1">
        <div className="flex items-center">
          <Label htmlFor={`switch-${id}`} className="font-medium text-base">
            {label}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {hasNumericInput && isEnabled && (
          <div className="flex flex-col items-end">
            {numericInputLabel && <Label htmlFor={`input-${id}`} className="text-xs mb-1">{numericInputLabel}</Label>}
            <Input
              id={`input-${id}`}
              type="number"
              value={numericInputValue ?? ''}
              onChange={handleInputChange}
              placeholder={numericInputPlaceholder}
              className="w-32 h-9" // Smaller input
              disabled={disabled || !isEnabled}
            />
          </div>
        )}
        <Switch
          id={`switch-${id}`}
          checked={isEnabled}
          onCheckedChange={handleToggle}
          disabled={disabled}
          aria-label={label}
        />
      </div>
    </div>
  );
};
export default PermissionSettingRow;
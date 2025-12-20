import SARSymbol from './SARSymbol';

interface PriceProps {
  amount: number | string;
  className?: string;
  symbolClassName?: string;
  showDecimals?: boolean;
}

export default function Price({ 
  amount, 
  className = '', 
  symbolClassName = '',
  showDecimals = true 
}: PriceProps) {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <SARSymbol className={symbolClassName || 'w-[1em] h-[1em]'} />
        0.00
      </span>
    );
  }
  
  const formattedAmount = showDecimals ? numAmount.toFixed(2) : Math.round(numAmount).toString();
  
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <SARSymbol className={symbolClassName || 'w-[1em] h-[1em]'} />
      {formattedAmount}
    </span>
  );
}

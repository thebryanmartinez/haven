import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bytefin/ui/components";
import { ThemeToggle } from "@bytefin/ui/components/theme";
import { PrivacyModeToggle } from "@/modules/shared/components/PrivacyModeToggle";
import { useLocalization, usePrivacyMode } from "@/modules/shared/hooks";
import { formatCurrency } from "@/modules/shared/lib/formatCurrency";

interface HeaderProps {
  balance: number;
}

const ANNUAL_INTEREST_RATE = 0.025;
const MONTHS_IN_YEAR = 12;

export const Header = ({ balance }: HeaderProps) => {
  const { t } = useLocalization();
  const { isPrivacyModeOn } = usePrivacyMode();
  const monthlyInterestEstimate =
    (balance * ANNUAL_INTEREST_RATE) / MONTHS_IN_YEAR;
  const formattedMonthlyInterest = formatCurrency(
    monthlyInterestEstimate,
    isPrivacyModeOn,
  );

  return (
    <section className="flex flex-row justify-between py-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              asChild
              variant="neutral"
              className="justify-self-start  text-[11px] tabular-nums shadow-shadow sm:text-xs"
            >
              <button type="button">~{formattedMonthlyInterest}/month</button>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            2.5% APY
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex flex-row gap-2 justify-self-end">
        <PrivacyModeToggle />
        <ThemeToggle />
      </div>
    </section>
  );
};

export default Header;

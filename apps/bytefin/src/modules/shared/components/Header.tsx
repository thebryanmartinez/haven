import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@bytefin/ui/components'
import { ThemeToggle } from '@bytefin/ui/components/theme'
import { useLocalization } from '@/modules/shared/hooks'

interface HeaderProps {
  balance: number
}

const ANNUAL_INTEREST_RATE = 0.025
const MONTHS_IN_YEAR = 12

export const Header = ({ balance }: HeaderProps) => {
  const { t } = useLocalization()
  const monthlyInterestEstimate =
    (balance * ANNUAL_INTEREST_RATE) / MONTHS_IN_YEAR
  const formattedMonthlyInterest = monthlyInterestEstimate.toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency: 'USD'
    }
  )

  return (
    <section className='flex flex-row justify-between py-4'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              asChild
              variant='neutral'
              className='justify-self-start  text-[11px] tabular-nums shadow-shadow sm:text-xs'
            >
              <button type='button'>~{formattedMonthlyInterest}/month</button>
            </Badge>
          </TooltipTrigger>
          <TooltipContent
            side='bottom'
            align='start'
          >
            2.5% APY
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className='justify-self-end'>
        <ThemeToggle />
      </div>
    </section>
  )
}

export default Header

import { Spinner } from "@bytefin/ui/components";
import { useLocalization } from "@/modules/shared/hooks";

interface LoadingProps {
  message?: string;
  className?: string;
}

export const Loading = ({ message, className }: LoadingProps) => {
  const { t } = useLocalization();
  const displayMessage = message || t("common.loading");
  return (
    <div
      className={`flex flex-col items-center justify-center py-8 px-6 rounded-base border-2 border-border bg-secondary-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-200 ${className}`}
    >
      <Spinner className="size-6" />
      <p className="mt-2 text-sm text-muted-foreground">{displayMessage}</p>
    </div>
  );
};

export default Loading;

import { useRef, useState } from "react";
import type { DeleteFundProps } from "@/modules/funds/interfaces";

export const useDeleteFund = ({ id, deleteFund }: DeleteFundProps) => {
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startPendingDelete = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPending(true);
    timeoutRef.current = setTimeout(() => {
      setIsPending(false);
      timeoutRef.current = null;
    }, 3000);
  };

  const handleDeleteFund = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
    deleteFund(id);
  };

  const handleDelete = () => {
    if (isPending) handleDeleteFund();
    else startPendingDelete();
  };

  return {
    handleDelete,
    isPending,
  };
};

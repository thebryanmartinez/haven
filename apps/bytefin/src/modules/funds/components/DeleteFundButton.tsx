import { Button } from "@bytefin/ui/components";
import { Check, Trash2 } from "lucide-react";
import { useDeleteFund } from "@/modules/funds/hooks";
import type { DeleteFundProps } from "@/modules/funds/interfaces";

export const DeleteFundButton = ({ id, deleteFund }: DeleteFundProps) => {
  const { handleDelete, isPending } = useDeleteFund({ id, deleteFund });

  return (
    <Button variant="neutral" size="icon" onClick={handleDelete}>
      {isPending ? <Check /> : <Trash2 />}
    </Button>
  );
};

export default DeleteFundButton;

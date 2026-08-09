import { useState } from "react";

export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean, callback: () => void) => {
    setIsOpen(isOpen);
    callback?.();
  };
  const handleClose = (callback: () => void) => {
    setIsOpen(false);
    callback?.();
  };

  return { isOpen, handleOpenChange, handleClose };
};

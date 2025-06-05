"use client";

import { useEffect, useState } from "react";
import { PrevireUserFileModal } from "../modals/preview-user-file-modal";
import { DeleteUserFileModal } from "../modals/delete-user-file-modal";
import { EditUserFileModal } from "../modals/edit-user-file-modal";

export const FileNestUserModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <PrevireUserFileModal />
      <DeleteUserFileModal />
      <EditUserFileModal />
    </>
  );
};

"use client";

import { useEffect, useState } from "react";
import { FilterModal } from "../modals/filter-modal";
import { SettingsModal } from "../modals/settings-modal";

export const AskAIModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <FilterModal />
      <SettingsModal />
    </>
  );
};

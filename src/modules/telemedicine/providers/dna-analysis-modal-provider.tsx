"use client";

import { useEffect, useState } from "react";
import { VariantComparisonModal } from "../modals/variant-comparison-modal";

export const DNAanalysisModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <VariantComparisonModal />
    </>
  );
};

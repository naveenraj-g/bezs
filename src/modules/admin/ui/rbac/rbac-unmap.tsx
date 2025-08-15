"use client";

import { useState } from "react";
import { useAdminModal } from "../../stores/use-admin-modal-store";
import { unmapRBACUserOrgRole } from "../../serveractions/RBAC/server-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RbacUnmap({
  orgId,
  roleId,
  userId,
}: {
  orgId: string;
  roleId: string;
  userId: string;
}) {
  const incrementTriggerRefetch = useAdminModal(
    (state) => state.incrementTrigger
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function unMapUser({
    orgId,
    roleId,
    userId,
  }: {
    orgId: string;
    roleId: string;
    userId: string;
  }) {
    try {
      setIsLoading(true);
      await unmapRBACUserOrgRole({
        orgId,
        roleId,
        userId,
      });
      incrementTriggerRefetch();
      toast("User Role unmapped Successfully.");
    } catch (err) {
      toast((err as Error).message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      className="cursor-pointer"
      size="sm"
      variant="destructive"
      onClick={() =>
        unMapUser({
          orgId,
          roleId,
          userId,
        })
      }
      disabled={isLoading}
    >
      UnMap
    </Button>
  );
}

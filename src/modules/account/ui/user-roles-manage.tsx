"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RBACsessionType } from "@/modules/auth/types/auth-types";
import { CircleCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { changeUserRole } from "@/modules/bezs/serveractions/server-actions";
import { toast } from "sonner";

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function UserRolesManage({
  rbacSessionData,
  currentRole,
  userId,
}: {
  rbacSessionData: RBACsessionType;
  currentRole: string;
  userId: string;
}) {
  const router = useRouter();

  const userRoles = new Set(
    rbacSessionData?.map((data: any) => data.role?.name).filter(Boolean)
  );

  const roles = ["guest", ...userRoles];

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmitROleChange(data: FormSchemaType) {
    const selectedRole = data.role;

    if (selectedRole === currentRole) {
      return;
    }

    try {
      await changeUserRole({ roleName: selectedRole, userId });
      toast("Role changed successfully!", {
        description: `You have changed the role to ${selectedRole}`,
      });
      router.refresh();
    } catch (error) {
      toast("Error!", {
        description: (error as Error).message || "Something went wrong",
      });
    }
  }

  return (
    <Card className="mt-8 p-4">
      <p>Current Role: {currentRole}</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitROleChange)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roles</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    defaultValue={currentRole}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-[210px] w-fit">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role, i) => (
                        <SelectItem key={i} value={role}>
                          {role}
                          {currentRole === role && (
                            <CircleCheckBig className="text-green-500" />
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="sm"
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            Change role
          </Button>
        </form>
      </Form>
    </Card>
  );
}

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { createServerActionProcedure } from "zsa";

export const authProcedures = createServerActionProcedure().handler(
  async () => {
    try {
      const session = await getServerSession();

      return session?.user?.id;
    } catch {
      throw new Error("Unauthorized");
    }
  }
);

import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { createServerActionProcedure } from "zsa";

export const authProcedures = createServerActionProcedure().handler(
  async () => {
    try {
      const session = await getServerSession();

      if (!session) {
        throw new Error("Unauthorized");
      }

      return session;
    } catch {
      throw new Error("Unauthorized");
    }
  }
);

import { prisma } from "@/lib/prisma";
import { authClient } from "@/modules/auth/services/better-auth/auth-client";

function initialCreateUserAdmin() {
  authClient.signUp.email({
    email: "testuser.gnr@gmail.com",
    password: "12345678",
    username: "admin",
    name: "Admin",
  });
}

// initialCreateUserAdmin();

async function initialSetup() {
  // retriving first created user
  const firstUser = await prisma.user.findFirst();

  // assigning admin role
  await prisma.user.update({
    where: {
      id: firstUser?.id,
    },
    data: {
      role: "admin",
    },
  });

  // creating Admin Hub organization
  await prisma.organization.create({
    data: {
      name: "Admin Hub",
      slug: "admin-hub",
      members: {
        create: {
          userId: firstUser?.id || "",
          role: "owner",
        },
      },
    },
  });
}

import AppNavbar from "@/components/sidebar/ui/app-navbar";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import { redirect } from "next/navigation";

const AppListingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <AppNavbar session={session} />
      {/* <BreadCrumb /> */}
      <main className="">{children}</main>
    </>
  );
};

export default AppListingLayout;

import RootNavBarPage from "@/components/sidebar/ui/root-navbar";
// import { getServerSession } from "@/modules/auth/services/better-auth/action";

const HomePage = async () => {
  // const session = await getServerSession();

  return (
    <>
      <RootNavBarPage />
    </>
  );
};

export default HomePage;

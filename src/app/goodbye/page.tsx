import RootNavBarPage from "@/components/sidebar/ui/root-navbar";

const GoodbyePage = () => {
  return (
    <div className="h-screen w-full">
      <RootNavBarPage />
      <div className="text-center mt-24">
        <h1>Your account has been deleted successfully.</h1>
        <p>Thank for your time!!!</p>
      </div>
    </div>
  );
};

export default GoodbyePage;

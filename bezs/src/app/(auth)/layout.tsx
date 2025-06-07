import RootNavBarPage from "@/components/sidebar/ui/root-navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="w-full min-h-screen">
        <RootNavBarPage />
        <div className="flex items-center justify-center min-h-[calc(100vh-48px)] p-4">
          {children}
        </div>
      </main>
    </>
  );
};

export default AuthLayout;

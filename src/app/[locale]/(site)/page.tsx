import RootNavBarPage from "@/components/sidebar/ui/root-navbar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "@/modules/auth/services/better-auth/action";
import Link from "next/link";

const HomePage = async () => {
  const session = await getServerSession();
  return (
    <>
      <RootNavBarPage />
    </>
    // <div className="m-10">
    //   <Card>
    //     <CardHeader>
    //       <CardTitle className="text-xl">Home Page</CardTitle>
    //       <CardDescription>Card Description</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       {!session && (
    //         <div className="flex gap-4">
    //           <Link href="/signin" className={buttonVariants()}>
    //             Sign In
    //           </Link>
    //           <Link href="/signup" className={buttonVariants()}>
    //             Sign Up
    //           </Link>
    //         </div>
    //       )}
    //     </CardContent>
    //     <CardFooter>
    //       {session && (
    //         <Link href="/bezs" className={buttonVariants()}>
    //           Get Started
    //         </Link>
    //       )}
    //     </CardFooter>
    //   </Card>
    // </div>
  );
};

export default HomePage;

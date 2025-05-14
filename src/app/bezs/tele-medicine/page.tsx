import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TeleMedicineHomePage = () => {
  return (
    <div className="h-[calc(100vh-53px)]">
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Welcome to <br />
              <span className="text-blue-700 text-5xl md:text-6xl">
                TeleMedicine
              </span>
            </h1>
          </div>

          <div className="text-center max-w-xl flex flex-col items-center justify-center">
            <p className="mb-8">
              Welcome to the Telemedicine page! Here you can find information
              about our telemedicine services.
            </p>

            <Link
              href="/bezs/tele-medicine/patient"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Go To Patient
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeleMedicineHomePage;

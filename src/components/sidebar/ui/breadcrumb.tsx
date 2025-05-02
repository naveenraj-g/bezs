"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, usePathname } from "@/i18n/navigation";
import { capitalizeString } from "@/utils/helper";

const BreadCrumb = ({ className = "" }: { className?: string }) => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const pathSegmentsLength = pathSegments.length;

  return (
    <Breadcrumb className={`px-4 py-2 ${className}`}>
      <BreadcrumbList>
        {pathSegments.map((pathSegment, index) => {
          const formattedPathSegment = pathSegment
            .split("-")
            .join(" ")
            .toLowerCase();
          const formattedPathSegmentLink = pathSegments
            .slice(
              0,
              pathSegments.findIndex((path) => path === pathSegment) + 1
            )
            .join("/");

          return index + 1 === pathSegmentsLength ? (
            <BreadcrumbItem key={pathSegment}>
              <BreadcrumbPage className="text-base text-primary font-medium">
                {capitalizeString(
                  formattedPathSegment === "bezs"
                    ? "Home"
                    : formattedPathSegment
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbList key={pathSegment}>
              <BreadcrumbItem key={pathSegment}>
                <Link
                  // href={
                  //   formattedPathSegment === "bezs"
                  //     ? "/bezs"
                  //     : `/bezs/${pathSegment}`
                  // }
                  href={`/${formattedPathSegmentLink}`}
                  className="text-base hover:text-foreground"
                >
                  {pathSegment === "bezs"
                    ? "Home"
                    : capitalizeString(formattedPathSegment)}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:size-4.5" />
            </BreadcrumbList>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;

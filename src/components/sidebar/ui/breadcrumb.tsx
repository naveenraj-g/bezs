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

const BreadCrumb = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const pathSegmentsLength = pathSegments.length;

  return (
    <Breadcrumb className="px-4 py-2 border-b-2">
      <BreadcrumbList>
        {pathSegments.map((pathSegment, index) => {
          return index + 1 === pathSegmentsLength ? (
            <BreadcrumbItem key={pathSegment}>
              <BreadcrumbPage className="text-base">
                {capitalizeString(
                  pathSegment === "bezs" ? "Home" : pathSegment
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbList key={pathSegment}>
              <BreadcrumbItem key={pathSegment}>
                <Link
                  href={
                    pathSegment === "bezs" ? "/bezs" : `/bezs/${pathSegment}`
                  }
                  className="text-base hover:text-foreground"
                >
                  {pathSegment === "bezs"
                    ? "Home"
                    : capitalizeString(pathSegment)}
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

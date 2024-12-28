import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type Props = {
  parents: Array<{
    title: string;
    link: string;
  }>;
  currently: string;
  classW?: string;
};

const BreadcrumbOnly = ({ parents, currently, classW }: Props) => {
  return (
    <Breadcrumb className={cn(classW)}>
      <BreadcrumbList>
        {parents.map((item, index) => (
          <React.Fragment key={item.title}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={item.link}
                className="hover:text-primary transition-all"
              >
                {item.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage className="text-accent">{currently}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbOnly;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

interface TopCategoriesProps {
  STATS: {
    topCategories: {
      name: string;
      percentage: number;
      icon: any;
    }[];
  };
}

const TopCategories: React.FC<TopCategoriesProps> = ({ STATS }) => {

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {STATS.topCategories.map((category, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex justify-center items-center gap-2">
                <FontAwesomeIcon icon={category.icon as any} />
                <span>{category.name}</span>
              </div>

              <span>{category.percentage}%</span>
            </div>
            <Progress value={category.percentage} className="w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopCategories;

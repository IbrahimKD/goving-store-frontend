"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatsDetailsProps {
  STATS: {
    totalUsers?: number;
    activeUsers?: number;
    blockedUsers?: number;
  };
  firstTitle?: string;
  secondTitle?: string;
  lastTitle?: string;
}

const UsersStatsDetails: React.FC<StatsDetailsProps> = ({
  STATS,
  firstTitle,
  secondTitle,
  lastTitle,
}) => {
  const [gridCounts, setGridCounts] = useState<number>(3);

  // استخدام useEffect لتحديث عدد الأعمدة بناءً على بيانات المستخدمين
  
  return (
    <div
      className={`grid gap-4 md:grid-cols-2 lg:grid-cols-${gridCounts} w-full mb-8`}
    >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {firstTitle ? firstTitle : "Total Users"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.totalUsers}</div>
          </CardContent>
        </Card>
      
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {secondTitle ? secondTitle : "Active Users"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.activeUsers}</div>
          </CardContent>
        </Card>
      
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {lastTitle ? lastTitle : "Blocked Users"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{STATS.blockedUsers}</div>
          </CardContent>
        </Card>
      
    </div>
  );
};

export default UsersStatsDetails;

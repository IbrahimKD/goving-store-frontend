"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const CategorySelector = ({
  categories,
  value,
  onChange,
  searchQueryCat,
  loadingCat,
  setSearchQueryCat,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQueryCat.toLowerCase())
    );
  }, [categories, searchQueryCat]);

  // Handle clicking outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current category title
  const currentCategory =
    value.name === "all" 
      ? { name: "All Categories", icon: null }
      : categories.find((cat) => cat._id === value._id) || {
          name: "Select Category",
          icon: null,
        };

  return (
    <div className="relative max-h-[400px]" ref={menuRef}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-[240px] gap-2 justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentCategory.icon && (
          <FontAwesomeIcon
            icon={currentCategory.icon as any}
            className="w-4 h-4"
          />
        )}
        <span className="truncate">
          {currentCategory.name ? currentCategory.name : "Select Category"}
        </span>{" "}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <Card className="absolute overflow-y-auto max-h-[260px] z-[3] top-[calc(100%+4px)] left-0 w-[240px] p-2">
          <Input
            placeholder="Search categories..."
            value={searchQueryCat}
            onChange={(e) => setSearchQueryCat(e.target.value)}
            className="mb-2"
          />

          <div className="max-h-[300px] overflow-y-auto space-y-1">
            <div
              className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                value.name === "all"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              }`}
              onClick={() => {
                onChange({ name: "all", _id: "" });
                setIsOpen(false);
              }}
            >
              All Categories
            </div>

            {loadingCat ? (
              <div className="mx-auto py-6">
                <div className="loader ease-linear rounded-full border-2 border-t-8 border-primary h-8 w-8 mx-auto "></div>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                    value._id === category._id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => {
                    onChange({ name: category.name, _id: category._id });
                    setIsOpen(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={category.icon as any}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))
            )}
          </div>

          {!loadingCat && filteredCategories.length === 0 && (
            <div className="py-6 text-center text-muted-foreground">
              No categories found.
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CategorySelector;


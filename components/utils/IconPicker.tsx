  import React, { useCallback, useState, useEffect } from "react";
  import { FixedSizeGrid as Grid } from "react-window";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { library } from "@fortawesome/fontawesome-svg-core";
  import { fas } from "@fortawesome/free-solid-svg-icons";

  // إضافة كل أيقونات Font Awesome Solid المجانية إلى المكتبة
  library.add(fas);

  export const IconPicker = ({
    showIconPicker,
    setShowIconPicker,
    handleIconSelect,
    searchTerm,
    setSearchTerm,
  }: any) => {
    const [icons, setIcons] = useState<string[]>([]);

    useEffect(() => {
      // الحصول على جميع أسماء الأيقونات المجانية من مكتبة Font Awesome
      const iconNames = Object.keys(fas).map((key) => fas[key].iconName);
      setIcons(iconNames);
    }, []);

    // تصفية الأيقونات بناءً على مصطلح البحث
    const filteredIcons = icons.filter((iconName: string) =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const IconCell = useCallback(
      ({ columnIndex, rowIndex, style }: any) => {
        const index = rowIndex * 10 + columnIndex;
        if (index >= filteredIcons.length) return null;

        const iconName = filteredIcons[index];

        return (
          <div
            style={style}
            onClick={() => handleIconSelect(iconName)}
            className="cursor-pointer flex flex-col items-center justify-center hover:bg-gray-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={iconName} size="lg" />
            <span className="text-xs text-white mt-1 truncate w-full text-center">
              {iconName}
            </span>
          </div>
        );
      },
      [filteredIcons, handleIconSelect]
    );

    if (!showIconPicker) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] h-[90%] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-accent">Choose Icon</h2>
            <Button onClick={() => setShowIconPicker(false)}>Close</Button>
          </div>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search icons..."
            className="mb-4"
          />
          <div className="w-full z-[100] flex-grow overflow-hidden">
            <Grid
              columnCount={10}
              rowCount={Math.ceil(filteredIcons.length / 10)}
              columnWidth={130}
              rowHeight={80}
              height={window.innerHeight * 0.7}
              width={window.innerWidth * 0.858}
              itemData={filteredIcons}
            >
              {IconCell}
            </Grid>
          </div>
        </div>
      </div>
    );
  };

import React from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "@/components/ui/button";

export const ImageCropper = ({
  image,
  cropperRef,
  getCroppedImage,
  handleImageChange,
}:any) => {
  if (!image) {
    return (
      <div>
        <input type="file" onChange={handleImageChange} accept="image/*" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Cropper
        src={image}
        style={{ height: 400, width: "100%" }}
        initialAspectRatio={1}
        guides={false}
        cropBoxResizable={true}
        viewMode={1}
        dragMode="move"
        ref={cropperRef}
      />
      <Button onClick={getCroppedImage} className="bg-secondary text-white">
        Crop Image
      </Button>
    </div>
  );
};

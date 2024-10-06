"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";

export default function CameraButton() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target?.result);
        };
        reader.readAsDataURL(file);
        setError(null);
      } else {
        setError("Please select an image file.");
        setImage(null);
      }
    }
  };

  const triggerFileInput = (captureMethod) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", captureMethod);
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image-upload">Upload or Take a Picture</Label>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={fileInputRef}
          aria-describedby="file-upload-error"
        />
        <div className="flex space-x-2">
          <Button onClick={() => triggerFileInput("user")} className="flex-1">
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <Button
            onClick={() => triggerFileInput("environment")}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Picture
          </Button>
        </div>
      </div>
      {error && (
        <p id="file-upload-error" className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt="Uploaded or captured image"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

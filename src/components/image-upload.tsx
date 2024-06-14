"use client";

import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import React from "react";
import Image from "next/image";
interface ImageUploadProps {
  value: string;
  onChange: (src: String) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
        onSuccess={(result: any) => {
          console.log("image url is", result.info.secure_url);
          onChange(result.info.secure_url);
        }}
        options={{ maxFiles: 1 }}
        uploadPreset="dzuhb6fj"
      >
        <div className="p-4 border-4 border-dashed border-primary/10 runded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
          <div className="relative h-40 w-40">
            <img
              alt="Upload"
              src={value || "/./placeholder.png"}
              className="rounded-lg object-fill h-40 w-40"
            />
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;

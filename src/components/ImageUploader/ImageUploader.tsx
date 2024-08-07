import React, { useState, ChangeEvent } from "react";
import styles from "./ImageUploader.module.css";

interface ImageUploaderProps {
  onImageUpload: (imageData: File | string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [fileName, setFileName] = useState<string>("Selecione uma imagem");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onImageUpload(file);
    }
  };

  return (
    <div className={styles.imageUploaderContainer}>
      <input
        type="file"
        id="imageFile"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      <label htmlFor="imageFile" className={styles.fileInputLabel}>
        {fileName}
      </label>
    </div>
  );
};

export default ImageUploader;

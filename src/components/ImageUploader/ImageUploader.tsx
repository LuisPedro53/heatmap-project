import React, { useState, ChangeEvent } from "react";
import styles from "./ImageUploader.module.css";

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
      setError(null);
      onImageUpload(file);
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setImageUrl(url);
    setSelectedFile(null);
    onImageUpload(url);
  };

  return (
    <div className={styles.imageUploaderContainer}>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        value={imageUrl}
        onChange={handleUrlChange}
        placeholder="Ou cole a URL da imagem"
      />

      {error && <p className={styles.error}>{error}</p>}

      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" className={styles.previewImage} />
      )}
    </div>
  );
};

interface ImageUploaderProps {
  onImageUpload: (imageData: File | string) => void;
}

export default ImageUploader;

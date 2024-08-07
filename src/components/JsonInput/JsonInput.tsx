import { useState, ChangeEvent } from "react";
import styles from "./JsonInput.module.css";

interface JsonInputProps {
  onJsonUpload: (jsonData: string) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onJsonUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Selecione um arquivo JSON");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          onJsonUpload(JSON.stringify(json));
          setError(null);
        } catch (error) {
          setError("Arquivo JSON inválido");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={styles.jsonInputContainer}>
      <input
        type="file"
        onChange={handleFileChange}
        id="jsonFile"
        className={styles.fileInput}
      />
      <label htmlFor="jsonFile" className={styles.fileInputLabel}>
        {fileName}
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default JsonInput;

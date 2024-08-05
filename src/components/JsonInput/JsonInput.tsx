import { useState, ChangeEvent } from "react";
import styles from "./JsonInput.module.css";

interface JsonInputProps {
  onJsonUpload: (jsonData: string) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onJsonUpload }) => {
  const [jsonData, setJsonData] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setJsonData(JSON.stringify(json, null, 2));
          onJsonUpload(JSON.stringify(json));
          setError(null);
        } catch (error) {
          setError("Arquivo JSON inválido");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const json = event.target.value;
    setJsonData(json);
    try {
      JSON.parse(json);
      onJsonUpload(json);
      setError(null);
    } catch (error) {
      setError("JSON inválido");
    }
  };

  return (
    <div className={styles.jsonInputContainer}>
      <textarea
        value={jsonData}
        onChange={handleTextAreaChange}
        placeholder="Cole o JSON aqui ou..."
        className={styles.textArea}
      />
      <input
        type="file"
        onChange={handleFileChange}
        id="jsonFile"
        className={styles.fileInput}
      />
      <label htmlFor="jsonFile" className={styles.fileInputLabel}>
        Selecione um arquivo JSON
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default JsonInput;

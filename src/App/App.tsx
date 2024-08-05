import { useState, useEffect } from "react";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import JsonInput from "../components/JsonInput/JsonInput";
import ObjectSelector from "../components/ObjectSelector/ObjectSelector";

function App() {
  const [imageData, setImageData] = useState<File | string | null>(null);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string>("");

  useEffect(() => {
    // Verificação condicional para garantir que jsonData existe
    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);
        // ... (resto da lógica para extrair os tipos de objetos) ...
      } catch (error) {
        console.error("Erro ao analisar o JSON:", error);
      }
    }
  }, [jsonData]);

  const handleJsonUpload = (data: string | File) => {
    if (typeof data === "string") {
      setJsonData(data);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonData(e.target?.result as string);
      };
      reader.readAsText(data);
    }
  };

  return (
    <div>
      <ImageUploader onImageUpload={setImageData} />
      <JsonInput onJsonUpload={handleJsonUpload} />
      <ObjectSelector jsonData={jsonData} onObjectSelect={setSelectedObject} />
    </div>
  );
}

export default App;

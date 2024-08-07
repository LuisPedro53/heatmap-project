import { useState } from "react";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import JsonInput from "../components/JsonInput/JsonInput";
import ObjectSelector from "../components/ObjectSelector/ObjectSelector";
import HeatmapGenerator from "../components/HeatmapGenerator/HeatmapGenerator";

function App() {
  const [imageData, setImageData] = useState<File | string | null>(null);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string>("");

  return (
    <div>
      <ImageUploader onImageUpload={setImageData} />
      <JsonInput onJsonUpload={setJsonData} />
      <ObjectSelector
        jsonData={jsonData}
        onObjectSelect={setSelectedObject}
        imageData={imageData}
      />
      <HeatmapGenerator
        imageData={imageData}
        jsonData={jsonData}
        selectedObject={selectedObject}
      />
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from "react";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import JsonInput from "../components/JsonInput/JsonInput";
import ObjectSelector from "../components/ObjectSelector/ObjectSelector";
import "./App.css"; // Importando o CSS

function App() {
  const [imageData, setImageData] = useState<File | string | null>(null);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string>("");
  const [heatmap, setHeatmap] = useState<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleImageLoad = () => {
      if (containerRef.current && imgRef.current) {
        const img = imgRef.current;
        containerRef.current.style.width = `${img.width}px`;
        containerRef.current.style.height = `${img.height}px`;

        if (!heatmap) {
          const newHeatmap = window.h337.create({
            container: containerRef.current,
            radius: 30,
            maxOpacity: 1,
            minOpacity: 0.5,
            blur: 0.5,
            gradient: {
              0.1: "blue",
              0.4: "cyan",
              0.7: "lime",
              1.0: "red",
            },
          });
          setHeatmap(newHeatmap);
        }
      }
    };

    if (imageData && imgRef.current) {
      if (imgRef.current.complete) {
        handleImageLoad();
      } else {
        imgRef.current.onload = handleImageLoad;
      }
    }
  }, [imageData, heatmap]);

  useEffect(() => {
    if (jsonData && heatmap) {
      try {
        const data = JSON.parse(jsonData);
        const points = data.hits.hits.flatMap((hit: any) =>
          (hit.fields["deepstream-msg"] || [])
            .filter((msg: string) => msg.split("|")[5] === selectedObject)
            .map((msg: string) => {
              const [, xMin, yMin, xMax, yMax, value] = msg.split("|");
              const x = (parseFloat(xMin) + parseFloat(xMax)) / 2;
              const y = (parseFloat(yMin) + parseFloat(yMax)) / 2;
              return { x, y, value: parseFloat(value) };
            })
        );

        heatmap.setData({ max: 10, data: points });
      } catch (error) {
        console.error("Erro ao processar o JSON:", error);
      }
    }
  }, [jsonData, heatmap, selectedObject]);

  const handleJsonUpload = (data: string | File) => {
    if (typeof data === "string") {
      setJsonData(data);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setJsonData(e.target?.result as string);
      reader.readAsText(data);
    }
  };

  return (
    <div className="appContainer">
      <ImageUploader onImageUpload={setImageData} />
      <JsonInput onJsonUpload={handleJsonUpload} />
      <ObjectSelector jsonData={jsonData} onObjectSelect={setSelectedObject} />
      <div className="containerImg">
        <div className="heatmapContainer" ref={containerRef}>
          {imageData && (
            <img
              ref={imgRef}
              src={
                typeof imageData === "string"
                  ? imageData
                  : URL.createObjectURL(imageData)
              }
              alt="Uploaded"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from "react";
import ImageUploader from "../components/ImageUploader/ImageUploader";
import JsonInput from "../components/JsonInput/JsonInput";
import ObjectSelector from "../components/ObjectSelector/ObjectSelector";

function App() {
  const [imageData, setImageData] = useState<File | string | null>(null);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string>("");
  const [heatmapInstance, setHeatmapInstance] = useState<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageData && containerRef.current && imageRef.current) {
      const imageElement = imageRef.current;

      const handleImageLoad = () => {
        containerRef.current!.style.width = `${imageElement.width}px`;
        containerRef.current!.style.height = `${imageElement.height}px`;

        // Clean up previous heatmap instance
        if (heatmapInstance) {
          heatmapInstance.remove();
        }

        // Initialize new heatmap instance
        const heatmap = window.h337.create({
          container: containerRef.current!,
          radius: 50,
          maxOpacity: 0.6,
          minOpacity: 0,
          blur: 0.9,
        });
        setHeatmapInstance(heatmap);
      };

      if (imageElement.complete) {
        handleImageLoad();
      } else {
        imageElement.onload = handleImageLoad;
      }
    }
  }, [imageData]);

  useEffect(() => {
    if (jsonData && heatmapInstance) {
      try {
        const data = JSON.parse(jsonData);

        const points = data.hits.hits.flatMap((hit: any) =>
          (hit.fields["deepstream-msg"] || [])
            .filter((message: string) => {
              const object = message.split("|")[5];
              return object === selectedObject;
            })
            .map((message: string) => {
              const [, xMin, yMin, xMax, yMax, value] = message.split("|");
              const x = (parseFloat(xMin) + parseFloat(xMax)) / 2;
              const y = (parseFloat(yMin) + parseFloat(yMax)) / 2;
              return { x, y, value: parseFloat(value) };
            })
        );

        // Clear previous data and set new data
        heatmapInstance.setData({
          max: 10, // Ajuste o valor máximo conforme necessário
          data: [], // Clear previous data
        });

        heatmapInstance.setData({
          max: 10, // Ajuste o valor máximo conforme necessário
          data: points,
        });
      } catch (error) {
        console.error("Erro ao processar o JSON:", error);
      }
    }
  }, [jsonData, heatmapInstance, selectedObject]);

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

      <div
        ref={containerRef}
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imageData && (
          <img
            ref={imageRef}
            src={
              typeof imageData === "string"
                ? imageData
                : URL.createObjectURL(imageData)
            }
            alt="Uploaded"
            style={{
              display: "block",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        )}
        <div
          id="heatmap"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;

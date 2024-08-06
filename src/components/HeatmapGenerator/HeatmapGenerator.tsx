import React, { useEffect, useRef } from "react";
import styles from "./HeatmapGenerator.module.css"; // Se você criar um arquivo CSS

interface HeatmapGeneratorProps {
  imageData: File | string;
  jsonData: string;
  selectedObject: string;
}

const HeatmapGenerator: React.FC<HeatmapGeneratorProps> = ({
  imageData,
  jsonData,
  selectedObject,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && imageData && jsonData && selectedObject) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Configuração do canvas
      const img = new Image();
      const heatmapInstance = window.h337;

      if (typeof imageData === "string") {
        img.src = imageData;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          generateHeatmap();
        };
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            generateHeatmap();
          };
        };
        reader.readAsDataURL(imageData);
      }

      const generateHeatmap = () => {
        const heatmapData = parseJsonData(jsonData, selectedObject);
        if (heatmapInstance && canvas) {
          heatmapInstance
            .create({
              container: canvas.parentElement as HTMLElement,
              maxOpacity: 0.6,
              radius: 10,
              blur: 0.9,
              backgroundColor: "rgba(0, 0, 0, 0)",
            })
            .setData({ max: 100, data: heatmapData });
        }
      };

      const parseJsonData = (json: string, objectType: string) => {
        const data = JSON.parse(json);
        const points = data.hits.hits.flatMap((hit: any) =>
          hit.fields["deepstream-msg"]
            .filter((msg: string) => msg.split("|")[5] === objectType)
            .map((msg: string) => {
              const [, xMin, yMin, xMax, yMax] = msg.split("|").map(parseFloat);
              return {
                x: (xMin + xMax) / 2, // Centróide
                y: (yMin + yMax) / 2,
                value: 1,
              };
            })
        );

        return points;
      };
    }
  }, [imageData, jsonData, selectedObject]);

  return <canvas ref={canvasRef} className={styles.heatmapCanvas}></canvas>;
};

export default HeatmapGenerator;

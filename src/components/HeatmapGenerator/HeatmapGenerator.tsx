import { useState, useEffect, useRef } from "react";
import styles from "./HeatmapGenerator.module.css";

interface HeatmapGeneratorProps {
  imageData: File | string | null;
  jsonData: string | null;
  selectedObject: string;
}

const HeatmapGenerator: React.FC<HeatmapGeneratorProps> = ({
  imageData,
  jsonData,
  selectedObject,
}) => {
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

  const downloadImage = () => {
    if (containerRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = imgRef.current;

      if (ctx && img) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (heatmap) {
          const heatmapCanvas = heatmap.getDataURL();
          const heatmapImg = new Image();
          heatmapImg.onload = () => {
            ctx.drawImage(heatmapImg, 0, 0);
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "heatmap.png";
            link.click();
          };
          heatmapImg.src = heatmapCanvas;
        } else {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = "image.png";
          link.click();
        }
      }
    }
  };

  return (
    <div className={styles.containerImg}>
      <div className={styles.heatmapContainer} ref={containerRef}>
        {imageData && (
          <img
            ref={imgRef}
            src={
              typeof imageData === "string"
                ? imageData
                : URL.createObjectURL(imageData)
            }
            alt="Uploaded"
            className={styles.img}
          />
        )}
      </div>
      <button className={styles.downloadButton} onClick={downloadImage}>
        Download Image
      </button>
    </div>
  );
};

export default HeatmapGenerator;

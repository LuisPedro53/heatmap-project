import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "./ObjectSelector.module.css";

interface ObjectSelectorProps {
  onObjectSelect: (objectType: string) => void;
  jsonData: string | null;
}

const ObjectSelector: React.FC<ObjectSelectorProps> = ({
  onObjectSelect,
  jsonData,
}) => {
  const [objectTypes, setObjectTypes] = useState<string[]>([]);
  const [selectedObject, setSelectedObject] = useState<string>("");

  useEffect(() => {
    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);

        // Acessar deepstream-msg dentro do primeiro elemento de hits
        if (
          data.hits &&
          data.hits.hits &&
          data.hits.hits.length > 0 &&
          data.hits.hits[0].fields["deepstream-msg"]
        ) {
          const uniqueObjectTypes = Array.from(
            new Set(
              data.hits.hits[0].fields["deepstream-msg"].map(
                (msg: string) => msg.split("|")[5]
              )
            )
          ) as string[];
          setObjectTypes(uniqueObjectTypes);
          setSelectedObject(uniqueObjectTypes[0]);
        } else {
          console.error(
            "O JSON não contém dados de 'deepstream-msg' ou está vazio."
          );
          setObjectTypes([]);
          setSelectedObject("");
        }
      } catch (error) {
        console.error("Erro ao analisar o JSON:", error);
        setObjectTypes([]);
        setSelectedObject("");
      }
    }
  }, [jsonData]);

  const handleObjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedObject(selected);
    onObjectSelect(selected);
  };

  return (
    <div className={styles.objectSelectorContainer}>
      <label htmlFor="objectSelect">Selecione o objeto:</label>
      <select
        id="objectSelect"
        value={selectedObject}
        onChange={handleObjectChange}
      >
        {objectTypes.map((objectType) => (
          <option key={objectType} value={objectType}>
            {objectType}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ObjectSelector;

import React, { useState } from "react";
import ImageUploader from "../components/ImageUploader/ImageUploader";

function App() {
  const [imageData, setImageData] = useState<File | string | null>(null);

  return (
    <div>
      <ImageUploader onImageUpload={setImageData} />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";

function App() {
  const [compressedImage, setCompressedImage] = useState(null);

  return (
    <div className="App">
      <ImageUploader setCompressedImage={setCompressedImage} />
    </div>
  );
}

export default App;

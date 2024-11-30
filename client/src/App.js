import React, { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import Header from "./components/Header";

function App() {
  const [compressedImage, setCompressedImage] = useState(null);

  return (
    <div className="App">
      <Header/>
      <ImageUploader setCompressedImage={setCompressedImage} />
    </div>
  );
}

export default App;

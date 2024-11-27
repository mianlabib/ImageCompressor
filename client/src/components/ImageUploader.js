import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FaDownload, FaTimes } from "react-icons/fa";
import { AiOutlineCloudDownload } from "react-icons/ai";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ImageUploader = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compressionComplete, setCompressionComplete] = useState(false);

  const fileInputRef = useRef(null); // Create a ref for the file input

  // Handle file drop and selection
  const handleDrop = (acceptedFiles) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
    const files = Array.isArray(acceptedFiles) ? acceptedFiles : [acceptedFiles];

    const newImages = files
      .filter((file) => {
        if (!file || !file.type) return false;
        if (validImageTypes.includes(file.type)) {
          return true;
        } else {
          toast.error(`The file ${file.name} is not a valid image type.`);
          return false;
        }
      })
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        compressionDetails: null,
      }));

    if (newImages.length > 0) {
      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Compress all selected images
  const compressAllImages = async () => {
    if (selectedImages.length === 0) {
      toast.error("Please upload some images to compress!");
      return;
    }

    setLoading(true);
    const updatedImages = [...selectedImages];

    try {
      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i];
        const formData = new FormData();
        formData.append("image", image.file);

        const response = await axios.post("http://localhost:5000/api/compress", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const { compressedImageUrl, originalSize, compressedSize, sizeReduction } = response.data;

        updatedImages[i] = {
          ...updatedImages[i],
          compressedImageUrl,
          compressionDetails: { originalSize, compressedSize, sizeReduction },
        };
      }

      setSelectedImages(updatedImages);
      setCompressionComplete(true);
    } catch (error) {
      console.error("Error during image compression:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove image from selected list
  const removeImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);

    if (updatedImages.length === 0) {
      setCompressionComplete(false);
    }
  };

  // Download all images after compression
  const downloadAllImages = () => {
    selectedImages.forEach((image, index) => {
      const link = document.createElement("a");
      link.href = image.compressedImageUrl;
      link.download = `compressed_image_${index + 1}.jpg`;
      link.click();
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/gif, image/svg+xml",
    onDrop: handleDrop,
    multiple: true,
  });

  // Handle image download
  const downloadImage = (compressedImageUrl, index) => {
    const link = document.createElement("a");
    link.href = compressedImageUrl;
    link.download = `compressed_image_${index + 1}.jpg`;
    link.click();
  };

  // Handle clicking Upload More
  const handleUploadMore = () => {
    // Check if fileInputRef is available before calling click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center w-full min-h-screen py-12 px-6 bg-gray-50">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Compress Your Images</h2>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Upload multiple images (JPG, PNG, SVG, GIF) to compress them with high quality and reduce their size.
        </p>

        {/* Image Upload */}
        {!selectedImages.length && !compressionComplete && (
          <div
            {...getRootProps()}
            className="w-full max-w-md h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer hover:border-blue-500"
          >
            <input {...getInputProps()} className="hidden" />
            <div className="flex flex-col items-center">
              <AiOutlineCloudDownload className="text-5xl text-gray-500 mb-4" />
              <span className="text-md text-gray-500">Drag & Drop or Click to Upload</span>
              <span className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, GIF, SVG</span>
            </div>
          </div>
        )}

        {/* Displaying Images */}
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap justify-center mt-6">
            {selectedImages.map((image, index) => (
              <div key={index} className="w-40 h-40 m-2 relative">
                <img
                  src={image.preview}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
                {/* Cross button to remove the image */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full p-1"
                >
                  <FaTimes className="text-xs" />
                </button>

                {/* Overlay for Compression details */}
                {image.compressionDetails && (
                  <div className="absolute inset-0 flex flex-col justify-between items-center bg-black bg-opacity-50 rounded-lg text-white">
                    <div className="flex flex-col justify-center items-center mt-4">
                      <p className="text-xs">
                        {image.compressionDetails.sizeReduction}% Smaller
                      </p>
                      <p className="text-xs">
                        {image.compressionDetails.originalSize} KB → {image.compressionDetails.compressedSize} KB
                      </p>
                    </div>

                    <button
                      onClick={() => downloadImage(image.compressedImageUrl, index)}
                      className="px-4 py-1 bg-green-600 rounded-md text-xs mb-4"
                    >
                      <FaDownload className="mr-2 inline-block" /> Download
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Buttons for Compress, Download, Upload More, and Upload New */}
        <div className="flex justify-center gap-x-4 mt-6">
          {/* Compress and Download All Button */}
          {!compressionComplete && (
            <button
              onClick={compressAllImages}
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 flex items-center"
            >
              {loading ? "Compressing..." : <><AiOutlineCloudDownload className="mr-2" /> Compress Images</>}
            </button>
          )}

          {/* Download All Button */}
          {compressionComplete && (
            <button
              onClick={downloadAllImages}
              className="bg-purple-600 text-white py-2 px-4 rounded-md flex items-center relative"
            >
              <AiOutlineCloudDownload className="mr-2" /> Download All
              <span className="absolute top-[-10px] right-[-10px] inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                {selectedImages.filter((image) => image.compressedImageUrl).length}
              </span>
            </button>
          )}

          {/* Upload More Button */}
          {!compressionComplete && selectedImages.length > 0 && (
            <button
              onClick={handleUploadMore}
              className="bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <AiOutlineCloudDownload className="mr-2" /> Upload More
            </button>
          )}

          {/* Upload New Button */}
          {compressionComplete && (
            <button
              onClick={() => {
                setSelectedImages([]);
                setCompressionComplete(false);
              }}
              className="bg-gray-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              Upload New
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && <p className="text-gray-700 mt-4">Compressing images, please wait...</p>}
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default ImageUploader;

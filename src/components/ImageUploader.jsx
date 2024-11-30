import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FaDownload, FaTimes } from "react-icons/fa";
import { AiOutlineCloudDownload } from "react-icons/ai";
import Footer from "./Footer";
import imageCompression from "browser-image-compression";
import toast ,{ Toaster } from "react-hot-toast";

const ImageUploader = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compressionComplete, setCompressionComplete] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For Sidebar State

  const fileInputRef = useRef(null); // Create a ref for the file input

  // Handle file drop and selection
  const handleDrop = async (acceptedFiles) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
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
  
        const options = {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Max width or height in pixels
          useWebWorker: true,
        };
  
        const compressedFile = await imageCompression(image.file, options);
        const compressedUrl = URL.createObjectURL(compressedFile);
  
        updatedImages[i] = {
          ...updatedImages[i],
          compressedImageUrl: compressedUrl,
          compressionDetails: {
            originalSize: (image.file.size / 1024).toFixed(2),
            compressedSize: (compressedFile.size / 1024).toFixed(2),
            sizeReduction: (
              ((image.file.size - compressedFile.size) / image.file.size) *
              100
            ).toFixed(2),
          },
        };
      }
  
      setSelectedImages(updatedImages);
      setCompressionComplete(true);
  
      // Show success toast after compression is done
      toast.success("Compression completed successfully!");
    } catch (error) {
      console.error("Error during image compression:", error);
      toast.error("An error occurred while compressing images.");
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
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
     },
    onDrop: handleDrop,
    multiple: true,
  });

  // Handle clicking Upload More
  const handleUploadMore = () => {
    // Check if fileInputRef is available before calling click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className={`flex flex-col items-center w-full min-h-screen py-12 px-6 bg-gray-50 ${isSidebarOpen ? 'z-20' : 'z-10'}`}>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Compress Your Images</h2>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Upload multiple images (JPG, PNG, WEBP, JPEG) to compress them with high quality and reduce their size.
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
              <span className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, JEPG, WEBP</span>
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
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full p-1"
                >
                  <FaTimes className="text-xs" />
                </button>

                {image.compressionDetails && (
                  <div className="absolute inset-0 flex flex-col justify-between items-center bg-black bg-opacity-50 rounded-lg text-white">
                    <div className="flex flex-col justify-center items-center mt-4">
                      <p className="text-xs">{image.compressionDetails.sizeReduction}% Smaller</p>
                      <p className="text-xs">
                        {image.compressionDetails.originalSize} KB → {image.compressionDetails.compressedSize} KB
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = image.compressedImageUrl;
                        link.download = `compressed_image_${index + 1}.jpg`;
                        link.click();
                      }}
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

        <div className="flex justify-center gap-x-4 mt-6">
          {!compressionComplete && (
            <button
              onClick={compressAllImages}
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 flex items-center"
            >
              {loading ? "Compressing..." : <><AiOutlineCloudDownload className="mr-2" /> Compress Images</>}
            </button>
          )}

          {compressionComplete && (
            <button
              onClick={downloadAllImages}
              className="bg-purple-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <AiOutlineCloudDownload className="mr-2" /> Download All
            </button>
          )}
        </div>

        {loading && <p className="text-gray-700 mt-4">Compressing images, please wait...</p>}
      </div>

      <Footer />
      <Toaster />
    </>
  );
};

export default ImageUploader;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import StudioHeader from '../components/studio/StudioHeader';
import UploadZone from '../components/studio/UploadZone';
import Viewer3D from '../components/studio/Viewer3D';
import ToolboxSidebar from '../components/studio/ToolboxSidebar';
import NavigationControls from '../components/studio/NavigationControls';

// API base URL - can be configured for different environments
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8001').replace(/\/$/, '');

const Studio = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  
  // Store original image for reset functionality
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  
  // 3D model related states
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [is3DLoading, setIs3DLoading] = useState(false);
  
  // Rim related states
  const [showRimUpload, setShowRimUpload] = useState(false);
  const [rimFile, setRimFile] = useState<File | null>(null);
  const [rimPreview, setRimPreview] = useState<string | null>(null);
  
  // Color related states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<{ r: number; g: number; b: number }>({
    r: 255,
    g: 0,
    b: 0
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (originalPreview) {
        URL.revokeObjectURL(originalPreview);
      }
      if (rimPreview) {
        URL.revokeObjectURL(rimPreview);
      }
      if (videoSource) {
        URL.revokeObjectURL(videoSource);
      }
    };
  }, []);

  const handleFileUpload = (file: File) => {
    console.log('Car image uploaded:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB', 'Type:', file.type);
    
    // Clean up old preview URLs if they exist
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    if (originalPreview) {
      URL.revokeObjectURL(originalPreview);
    }
    
    // Create a copy of the file for the original
    const originalFileCopy = new File([file], file.name, { type: file.type });
    
    // Set current and original files
    setUploadedFile(file);
    setOriginalFile(originalFileCopy);
    
    // Create and store URLs
    const objectUrl = URL.createObjectURL(file);
    const originalUrl = URL.createObjectURL(originalFileCopy);
    
    setImagePreview(objectUrl);
    setOriginalPreview(originalUrl);
  };

  const handleRimUpload = (file: File) => {
    console.log('Rim image uploaded:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB', 'Type:', file.type);
    
    // Clean up old preview URL
    if (rimPreview) {
      URL.revokeObjectURL(rimPreview);
    }
    
    setRimFile(file);
    const objectUrl = URL.createObjectURL(file);
    setRimPreview(objectUrl);
  };

  // Handle reset to original image
  const handleReset = () => {
    if (!originalFile || !originalPreview) {
      toast.error('No original image to reset to');
      return;
    }
    
    // Clean up current preview if it exists
    if (imagePreview && imagePreview !== originalPreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Create a new copy of the original file to avoid reference issues
    const resetFileCopy = new File([originalFile], originalFile.name, { type: originalFile.type });
    
    // Set the current file to the original
    setUploadedFile(resetFileCopy);
    
    // Create a new preview URL for the reset
    const resetPreviewUrl = URL.createObjectURL(resetFileCopy);
    setImagePreview(resetPreviewUrl);
    
    // Exit 3D mode if active
    if (is3DMode) {
      setIs3DMode(false);
    }
    
    toast.success('Reset to original image');
  };

  const handle3DGeneration = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a car image first');
      return;
    }
    
    // Reset previous 3D video if exists
    if (videoSource) {
      URL.revokeObjectURL(videoSource);
      setVideoSource(null);
    }
    
    setIs3DLoading(true);
    setError(null);
    setIs3DMode(true);
    
    console.log('Preparing to generate 3D model:');
    console.log('Car image:', uploadedFile.name, 'Size:', (uploadedFile.size / 1024).toFixed(2), 'KB', 'Type:', uploadedFile.type);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      
      console.log('Sending request to API endpoint:', `${API_BASE_URL}/generate_3d`);
      
      const response = await axios.post(`${API_BASE_URL}/generate_3d`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'video/mp4, video/*, application/json',
        },
        responseType: 'blob',
        timeout: 60000, // 60 second timeout as this might take longer
      });
      
      console.log('API Response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers['content-type'],
        contentLength: response.headers['content-length'],
      });
      
      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      // Check if the response is JSON (likely an error)
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const jsonResponse = JSON.parse(reader.result as string);
            console.error('API returned JSON error:', jsonResponse);
            setError(jsonResponse.detail || 'Unknown API error');
            toast.error(jsonResponse.detail || 'Unknown API error');
          } catch (e) {
            console.error('Failed to parse JSON response:', e);
            setError('Failed to process API response');
            toast.error('Failed to process API response');
          }
        };
        reader.readAsText(response.data);
        setIs3DMode(false);
        return;
      }
      
      // Determine the correct MIME type for the blob
      let mimeType = 'video/mp4';
      if (contentType) {
        if (contentType.includes('video/')) {
          mimeType = contentType;
        }
      }
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: mimeType });
      
      console.log('Created blob from response:', {
        size: blob.size,
        type: blob.type
      });
      
      if (blob.size === 0) {
        throw new Error('Received empty video from API');
      }
      
      // Create URL for the video
      const videoUrl = URL.createObjectURL(blob);
      setVideoSource(videoUrl);
      
      toast.success('3D model generated successfully!');
      
    } catch (error: unknown) {
      console.error('Error generating 3D model:', error);
      
      let errorMessage = 'Failed to generate 3D model. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });
        
        errorMessage = `API error (${error.response.status}): Please check if the API server is running`;
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('Error request:', error.request);
        errorMessage = 'No response from server. Please check if the API server is running at http://127.0.0.1:8001';
      } else {
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setIs3DMode(false);
    } finally {
      setIs3DLoading(false);
    }
  };

  const handleApplyRims = async () => {
    if (!uploadedFile || !rimFile) {
      toast.error('Both car and rim images are required');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    // Verify files before sending
    console.log('Preparing to apply rims:');
    console.log('Car image:', uploadedFile.name, 'Size:', (uploadedFile.size / 1024).toFixed(2), 'KB', 'Type:', uploadedFile.type);
    console.log('Rim image:', rimFile.name, 'Size:', (rimFile.size / 1024).toFixed(2), 'KB', 'Type:', rimFile.type);
    
    try {
      const formData = new FormData();
      
      // Important: Use the correct parameter names as expected by the API
      formData.append('car_file', uploadedFile);
      formData.append('rim_file', rimFile);
      
      // Log form data entries (for debugging)
      for (const pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }
      
      console.log('Sending request to API endpoint:', `${API_BASE_URL}/segment_car_rims`);
      
      const response = await axios.post(`${API_BASE_URL}/segment_car_rims`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'image/jpeg, image/png, application/json',
        },
        responseType: 'blob',
        timeout: 30000, // 30 second timeout
      });
      
      console.log('API Response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers['content-type'],
        contentLength: response.headers['content-length'],
      });
      
      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      // Check if the response is an image or JSON
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        // It's a JSON response, likely an error
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const jsonResponse = JSON.parse(reader.result as string);
            console.error('API returned JSON error:', jsonResponse);
            setError(jsonResponse.detail || 'Unknown API error');
            toast.error(jsonResponse.detail || 'Unknown API error');
          } catch (e) {
            console.error('Failed to parse JSON response:', e);
            setError('Failed to process API response');
            toast.error('Failed to process API response');
          }
        };
        reader.readAsText(response.data);
        return;
      }
      
      // Handle image response
      if (!contentType || (!contentType.includes('image/jpeg') && !contentType.includes('image/png'))) {
        console.warn('Unexpected content type:', contentType);
        // Continue anyway, try to process as image
      }
      
      // Clean up old preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      // Create a new image preview from the response
      const blob = new Blob([response.data], { 
        type: contentType || 'image/jpeg' 
      });
      
      console.log('Created blob from response:', {
        size: blob.size,
        type: blob.type
      });
      
      if (blob.size === 0) {
        throw new Error('Received empty image from API');
      }
      
      const objectUrl = URL.createObjectURL(blob);
      
      // Test that the image loads correctly
      const img = new Image();
      
      img.onload = () => {
        console.log('Image loaded successfully with dimensions:', img.width, 'x', img.height);
        
        // Create a File from the blob
        const fileName = `car_with_rims_${Date.now()}.${contentType?.includes('png') ? 'png' : 'jpg'}`;
        const fileFromBlob = new File([blob], fileName, { type: blob.type });
        console.log('Created file from blob:', fileFromBlob.name, fileFromBlob.type, fileFromBlob.size);
        
        // Set the new image and close modal only after successful load
        setUploadedFile(fileFromBlob);
        setImagePreview(objectUrl);
        setShowRimUpload(false);
        toast.success('Rims applied successfully!');
      };
      
      img.onerror = (e) => {
        console.error('Error loading image from blob:', e);
        URL.revokeObjectURL(objectUrl);
        setError('Error displaying the processed image');
        toast.error('Error displaying the processed image');
      };
      
      // Set the source to load the image
      img.src = objectUrl;
      
    } catch (error: unknown) {
      console.error('Error applying rims:', error);
      
      // Get more detailed error information
      let errorMessage = 'Failed to apply rims. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });
        
        errorMessage = `API error (${error.response.status}): Please check if the API server is running`;
      } else if (axios.isAxiosError(error) && error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        errorMessage = 'No response from server. Please check if the API server is running at http://127.0.0.1:8001';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyColor = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a car image first');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    // Verify color and file before sending
    console.log('Preparing to apply color:');
    console.log('Car image:', uploadedFile.name, 'Size:', (uploadedFile.size / 1024).toFixed(2), 'KB', 'Type:', uploadedFile.type);
    console.log('Color:', selectedColor);
    
    try {
      const formData = new FormData();
      
      // Use the current image as the file to send
      formData.append('file', uploadedFile);
      
      console.log('Sending request to API endpoint:', 
        `${API_BASE_URL}/change_car_color?r=${selectedColor.r}&g=${selectedColor.g}&b=${selectedColor.b}`);
      
      const response = await axios.post(
        `${API_BASE_URL}/change_car_color?r=${selectedColor.r}&g=${selectedColor.g}&b=${selectedColor.b}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'image/jpeg, image/png, application/json',
          },
          responseType: 'blob',
          timeout: 30000, // 30 second timeout
        }
      );
      
      console.log('API Response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers['content-type'],
        contentLength: response.headers['content-length'],
      });
      
      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      // Check if the response is an image or JSON
      const contentType = response.headers['content-type'];
      
      if (contentType && contentType.includes('application/json')) {
        // It's a JSON response, likely an error
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const jsonResponse = JSON.parse(reader.result as string);
            console.error('API returned JSON error:', jsonResponse);
            setError(jsonResponse.detail || 'Unknown API error');
            toast.error(jsonResponse.detail || 'Unknown API error');
          } catch (e) {
            console.error('Failed to parse JSON response:', e);
            setError('Failed to process API response');
            toast.error('Failed to process API response');
          }
        };
        reader.readAsText(response.data);
        return;
      }
      
      // Clean up old preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      // Create a new image preview from the response
      const blob = new Blob([response.data], { 
        type: contentType || 'image/jpeg' 
      });
      
      console.log('Created blob from response:', {
        size: blob.size,
        type: blob.type
      });
      
      if (blob.size === 0) {
        throw new Error('Received empty image from API');
      }
      
      const objectUrl = URL.createObjectURL(blob);
      
      // Test that the image loads correctly
      const img = new Image();
      
      img.onload = () => {
        console.log('Image loaded successfully with dimensions:', img.width, 'x', img.height);
        
        // Create a File from the blob
        const colorHex = rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b).replace('#', '');
        const fileName = `car_color_${colorHex}_${Date.now()}.${contentType?.includes('png') ? 'png' : 'jpg'}`;
        const fileFromBlob = new File([blob], fileName, { type: blob.type });
        console.log('Created file from blob:', fileFromBlob.name, fileFromBlob.type, fileFromBlob.size);
        
        // Set the new image and close modal only after successful load
        setUploadedFile(fileFromBlob);
        setImagePreview(objectUrl);
        setShowColorPicker(false);
        toast.success('Color applied successfully!');
      };
      
      img.onerror = (e) => {
        console.error('Error loading image from blob:', e);
        URL.revokeObjectURL(objectUrl);
        setError('Error displaying the processed image');
        toast.error('Error displaying the processed image');
      };
      
      // Set the source to load the image
      img.src = objectUrl;
      
    } catch (error: unknown) {
      console.error('Error applying color:', error);
      
      // Get more detailed error information
      let errorMessage = 'Failed to apply color. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });
        
        errorMessage = `API error (${error.response.status}): Please check if the API server is running`;
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('Error request:', error.request);
        errorMessage = 'No response from server. Please check if the API server is running at http://127.0.0.1:8001';
      } else {
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 0, b: 0 };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#1A1A1A] relative"
    >
      {/* Cyber grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10">
        <StudioHeader />
        
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="flex-1 relative">
            {!uploadedFile ? (
              <UploadZone onFileUpload={handleFileUpload} />
            ) : is3DMode ? (
              <Viewer3D videoSource={videoSource || undefined} isLoading={is3DLoading} />
            ) : (
              <div className="h-full p-4 flex items-center justify-center">
                <div className="relative w-full h-full max-w-4xl rounded-xl overflow-hidden border-2 border-[#00F0FF]/30">
                  {isProcessing ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                      <div className="text-[#00F0FF] font-orbitron text-xl animate-pulse">
                        Processing...
                      </div>
                    </div>
                  ) : null}
                  {error && (
                    <div className="absolute top-4 left-0 right-0 mx-auto text-center z-10">
                      <div className="bg-red-500/80 text-white px-4 py-2 rounded-md inline-block">
                        {error}
                      </div>
                    </div>
                  )}
                  <img 
                    key={imagePreview} // Force re-render when URL changes
                    src={imagePreview!} 
                    alt="Uploaded car" 
                    className="w-full h-full object-contain"
                    style={{ filter: 'drop-shadow(0 0 12px rgba(0, 240, 255, 0.3))' }}
                  />
                </div>
              </div>
            )}
          </div>
          <ToolboxSidebar 
            onView3DClick={handle3DGeneration} 
            onWheelsClick={() => setShowRimUpload(true)}
            onPaintClick={() => setShowColorPicker(true)}
            onResetClick={handleReset}
          />
        </div>

        <NavigationControls />
      </div>
      
      {/* Rim Upload Modal */}
      {showRimUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#101010] border-2 border-[#00F0FF]/30 p-6 rounded-xl w-[90%] max-w-2xl"
          >
            <h2 className="text-2xl font-orbitron text-white mb-4 text-center">Change Rims</h2>
            
            <div className="flex flex-col space-y-4">
              {!rimFile ? (
                <UploadZone onFileUpload={handleRimUpload} />
              ) : (
                <div className="relative h-48 rounded-lg overflow-hidden border border-[#00F0FF]/30">
                  <img 
                    src={rimPreview!} 
                    alt="Rim preview" 
                    className="w-full h-full object-contain"
                  />
                  <button 
                    onClick={() => setRimFile(null)}
                    className="absolute top-2 right-2 bg-red-500/80 text-white p-1 rounded-full text-xs"
                  >
                    Change
                  </button>
                </div>
              )}
              
              <div className="flex space-x-4 justify-end">
                <button 
                  onClick={() => setShowRimUpload(false)}
                  className="px-4 py-2 rounded-md bg-gray-800 text-white font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApplyRims}
                  disabled={!rimFile || isProcessing}
                  className={`
                    px-4 py-2 rounded-md font-medium
                    ${!rimFile || isProcessing 
                      ? 'bg-[#00F0FF]/30 text-white/50 cursor-not-allowed' 
                      : 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/80'}
                  `}
                >
                  {isProcessing ? 'Processing...' : 'Apply Rims'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#101010] border-2 border-[#00F0FF]/30 p-6 rounded-xl w-[90%] max-w-2xl"
          >
            <h2 className="text-2xl font-orbitron text-white mb-4 text-center">Change Car Color</h2>
            
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-center space-x-6">
                {/* Color preview */}
                <div 
                  className="w-24 h-24 rounded-lg border-2 border-white/30"
                  style={{ 
                    backgroundColor: rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b),
                    boxShadow: `0 0 20px ${rgbToHex(selectedColor.r, selectedColor.g, selectedColor.b)}80`
                  }}
                ></div>
                
                {/* Color picker */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm flex justify-between">
                      <span>Red: {selectedColor.r}</span>
                      <span className="text-red-500">{selectedColor.r}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="255" 
                      value={selectedColor.r}
                      onChange={(e) => setSelectedColor({...selectedColor, r: parseInt(e.target.value)})}
                      className="w-full accent-red-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white text-sm flex justify-between">
                      <span>Green: {selectedColor.g}</span>
                      <span className="text-green-500">{selectedColor.g}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="255" 
                      value={selectedColor.g}
                      onChange={(e) => setSelectedColor({...selectedColor, g: parseInt(e.target.value)})}
                      className="w-full accent-green-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white text-sm flex justify-between">
                      <span>Blue: {selectedColor.b}</span>
                      <span className="text-blue-500">{selectedColor.b}</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="255" 
                      value={selectedColor.b}
                      onChange={(e) => setSelectedColor({...selectedColor, b: parseInt(e.target.value)})}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Color presets */}
              <div className="flex justify-center flex-wrap gap-2">
                {[
                  { name: 'Red', color: '#FF0000' },
                  { name: 'Blue', color: '#0000FF' },
                  { name: 'Green', color: '#00FF00' },
                  { name: 'Yellow', color: '#FFFF00' },
                  { name: 'Purple', color: '#800080' },
                  { name: 'Orange', color: '#FFA500' },
                  { name: 'Black', color: '#000000' },
                  { name: 'White', color: '#FFFFFF' },
                ].map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedColor(hexToRgb(preset.color))}
                    className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden"
                    style={{ 
                      backgroundColor: preset.color,
                      boxShadow: `0 0 10px ${preset.color}80`
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
              
              <div className="flex space-x-4 justify-end">
                <button 
                  onClick={() => setShowColorPicker(false)}
                  className="px-4 py-2 rounded-md bg-gray-800 text-white font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApplyColor}
                  disabled={isProcessing}
                  className={`
                    px-4 py-2 rounded-md font-medium
                    ${isProcessing 
                      ? 'bg-[#00F0FF]/30 text-white/50 cursor-not-allowed' 
                      : 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/80'}
                  `}
                >
                  {isProcessing ? 'Processing...' : 'Apply Color'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Studio;
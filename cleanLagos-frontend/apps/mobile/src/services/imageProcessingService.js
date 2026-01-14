// Simple image processing service stub for mobile app

export const processImage = async (imageUri, createThumbnail = false) => {
  // Stub implementation for mobile testing
  console.log('Process image called with:', imageUri, 'createThumbnail:', createThumbnail);
  
  return Promise.resolve({
    success: true,
    full: imageUri,
    thumbnail: createThumbnail ? imageUri : null,
    message: 'Image processed successfully (stub)'
  });
};
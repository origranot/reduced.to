export const resizeImage = (file: any, maxWidth: number, maxHeight: number, quality: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create an image object
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      // Create a canvas with the desired dimensions
      const canvas = document.createElement('canvas');
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the resized image on the canvas
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(image, 0, 0, width, height);

      // Convert the canvas to a data URL
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        quality
      );
    };

    image.onerror = (error) => reject(error);
  });
};

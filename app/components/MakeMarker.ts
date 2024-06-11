export const MakeMarker = (image_url: string, filename: string, pin_url: string): Promise<{ marker_url: File, marker_filename: string }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const image2 = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const edge = 40;
      const radius = image.width / 2 - edge;
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, image.width, image.height);

      image2.onload = () => {
        context.save();
        context.beginPath();
        context.arc(image.width / 2, image.width / 2, radius, 0, 2 * Math.PI);
        context.closePath();
        context.clip();
        context.drawImage(image2, 0, 0, image2.width, image2.height, edge, edge, radius * 2 + edge, radius * 2 + edge);
        context.restore();

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to convert canvas to Blob'));
            return;
          }
          const marker_filename = filename + (pin_url === 'ピン青.jpg' ? '_ping_blue.jpg' : '_ping_pink.jpg');
          const marker_file = new File([blob], marker_filename, { type: 'image/png' });
          resolve({ marker_url: marker_file, marker_filename: marker_filename });
        }, 'image/png');
      };
      image2.src = image_url;
    };

    image.src = pin_url;
  });
};
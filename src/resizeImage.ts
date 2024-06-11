export const resizeImage = (file: File, aspectRatio: number): Promise<{ resizedFile: File }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          let srcWidth = img.width;
          let srcHeight = img.height;
          let destWidth = img.width;
          let destHeight = img.height;
  
          // 横長の場合
          if (srcWidth / srcHeight > aspectRatio) {
            destHeight = srcHeight-srcHeight%4;
            destWidth = destHeight * aspectRatio;
          } else {
            // 縦長の場合
            destWidth = srcWidth-srcWidth%3;
            destHeight = destWidth / aspectRatio;
          }
  
          canvas.width = destWidth;
          canvas.height = destHeight;
  
          // 切り取り位置を中央にする
          const startX = (srcWidth - destWidth) / 2;
          const startY = (srcHeight - destHeight) / 2;
  
          if (ctx) {
            ctx.drawImage(img, startX, startY, destWidth, destHeight, 0, 0, destWidth, destHeight);
            canvas.toBlob((blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, { type: file.type });
                resolve({ resizedFile });
              }
            }, file.type);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };
  
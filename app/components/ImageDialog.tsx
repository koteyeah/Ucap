'use client';
import React, { useRef, useCallback } from 'react';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

interface ImageDialogProps {
  src: string;
  alt?: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ src, alt = '' }) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  /**
   * ダイアローグを開く処理
   */
  const handleOpenDialog = useCallback(() => {
    if (ref.current) ref.current.showModal();
  }, []);

  /**
   * ダイアローグを閉じる処理
   */
  const handleCloseDialog = useCallback(() => {
    if (ref.current) ref.current.close();
  }, []);

  /**
   * ダイアローグ内のクリックイベントハンドラーに渡す処理
   */
  const handleClickInDialog = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
    },
    []
  );

  return (
    <React.Fragment>
      <div
        role="button"
        onClick={handleOpenDialog}
        // onKeyDown={handleOpenDialog}
        className="image-box"
        tabIndex={0}
        style={{ 
          cursor: 'zoom-in', 
          width: `100%`,
          height: `100%`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img 
            src={src} 
            alt={alt} 
            style={{
            width: '100%',
            height: '90%',
            objectFit: 'cover',
            objectPosition: 'center',
          }} />
      </div>
      <dialog
        ref={ref}
        className="image-dialog"
        onClick={handleCloseDialog}

      >
        

        <div
          onClick={handleClickInDialog}
          className="contents"
          style={{cursor: 'default'}}
        >
          <style>
            {`
              .image-dialog::backdrop {
                cursor: zoom-out;
              }
            `}
          </style>
          <Box className="image-dialog" sx={{height: 0,textAlign: "right"}}>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon className="image-dialog"/>
            </IconButton>
          </Box>
          <img src={src} alt={alt} width="300" />
        </div>
      </dialog>
    </React.Fragment>
  );
};

export default ImageDialog;

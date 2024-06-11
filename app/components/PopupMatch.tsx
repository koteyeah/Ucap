"use client"
import React from 'react'
import { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { css, keyframes } from '@emotion/react';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Zoom from '@mui/material/Zoom';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography} from '@mui/material';
import "../font.css"

const popUp = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;
const icon = (
  <Paper 
    sx={{ 
      m: 1, 
      width: 100, 
      height: 100,
      backgroundColor: 'orange', // 背景色を設定
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // 影の効果を追加
      borderRadius: '50%', // 角丸にする
      display: 'flex', // 内容を中央に配置するために flexbox を使用
      justifyContent: 'center',
      alignItems: 'center',
    }} 
    elevation={4}
  > 
    <Typography variant="h2" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' ,fontFamily:'BungeeShade-Regular, sans-serif'}}>
    MATCH!!
    </Typography>
  </Paper>)

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  //animation: `${popUp} 0.5s ease-in-out`,
};

const App = () => {
  const [open, setOpen] = useState(true);

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <button onClick={handleOpen}>match</button> */}
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* <Zoom className="p-16 w-1/2 h-1/2" style={{ transitionDelay: open ? '500ms' : '0ms' }}>
          {icon}
        </Zoom> */}
        <Box sx={style}>
          <h2 id="modal-title">Pop Up</h2>
          <p id="modal-description">This is a pop-up message.</p>
        </Box>
      </Modal>
    </div>
  );
};

export default App;



"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import { Typography, Button } from '@mui/material';
import "../font.css";
import Slide from '@mui/material/Slide';
import {Player} from '@lottiefiles/react-lottie-player';
import Animation_geometric from '../Animation_geometric.json'
import Animation_back_grade from '../Animation _back_gradation.json'
import  Animation_kamihibuki from "../Animation_kamihubuki.json";
import  Animation_kamihibuki2 from "../Animation_kamihubuki2.json";
import  Animation_kamihubuki3 from "../Animation_kamihubuki3.json";
import  Animation_jungle from "../Animation-jungle.json";
import { Translate } from '@mui/icons-material';

const icon = (
  <Paper 
    sx={{ 
      m: -8, 
      width: '49vw', 
      height: '49vw',
      maxWidth:'420px',
      maxHeight:'420px',
      //aspectRatio: "2/ 1",
      backgroundColor: '#165e83',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      borderRadius: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }} 
    elevation={4}
  >
    <Typography  sx={{fontSize:'10vw', maxFontSize: '20px' ,mr: 0,color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontFamily:'BungeeShade-Regular, sans-serif' }}>
      MATCH!!
    </Typography>
  </Paper>
);



interface Props {
  isMatch: boolean;
  setIsMatch: React.Dispatch<React.SetStateAction<boolean>>;
  image_url: string;
  setMatchIndex: React.Dispatch<React.SetStateAction<number|null>>;
  image_name: string;
}

export default function SimpleZoom1({isMatch, setIsMatch, image_url, setMatchIndex, image_name}: Props) {
  // const [checked, setChecked] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(true);

  const icon2 = (
    <Paper 
      sx={{ 
        m: -8, 
        width:'56vw', 
        height: '56vw',
        maxWidth:'480px',
        maxHeight:'480px',
        // backgroundColor: '#f0908d',
        background:"no-repeat center /100% url("+image_url+") ",
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 1.0)',
        borderRadius: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }} 
      elevation={4}
    >
      {/* <Typography variant="h2" sx={{ml: 10,color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', fontFamily: 'BungeeShade-Regular, sans-serif' }}>
         UCAP
      </Typography> */}
    </Paper>
  );


  // const handleChange = () => {
  //   setChecked((prev) => !prev);
  //   setOpenModal(true);
  // };

  const handleCloseModal = () => {
    setIsMatch(false);
    setMatchIndex(null);
    setOpenModal(false);
  };
  
  return (
    <Box >
      {/* <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="Show"
      /> */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={{ style: { backgroundColor: 'transparent' } }}
        sx={{ 
          // my:7, 
          background:'linear-gradient(45deg, #f0908d, #2ca9e1)',
          boxShadow: '0px 4px 10px rgba(0, 0.1, 0, 0.1)',
          //borderRadius: '100%',
          // border:'none !important',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }} 
      >
        <Box  sx={{ border:'blue',outline:'none'}}>
   

          <Player  className="z-0 " speed={0.1} autoplay loop src={Animation_jungle} style={{ position: "relative",
           //background: "linear-gradient(45deg, #f0908d, #2ca9e1)",
           }} /> 
            {/* <Player className="z-0 " speed={0.1} autoplay loop src={Animation_geometric} style={{ position: "relative",
           //background: "linear-gradient(45deg, #f0908d, #2ca9e1)",
           }} >  */}
              <Player className="z-20 opacity-80" speed={0.3} autoplay loop src={Animation_kamihubuki3}  style= {{ position:'absolute', top: '50%',left: '50%',transform: 'translate(-50%, -50%)',height:"150%",width:"100%"}}/> 

              <Box
                className="z-10 flex"
                sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                maxWidth: '100vw',
                transform: 'translate(-50%, -50%)',
                animation: 'slow-bounce 2s infinite',
                pointerEvents: 'none',
                }}>
                  <Slide className="z-20 /*mix-blend-multiply*/" direction="up" in={true}  mountOnEnter unmountOnExit>
                  {icon}
                  </Slide>
                  <Slide className="z-10" direction="down" in={true} mountOnEnter unmountOnExit>
                  {icon2}
                  </Slide>
              </Box>

              
          <Box  
          sx={{ 
            position: "absolute",
            bottom: 16,
            display:'flex', 
            flexDirection: "column",
            mt: 2,
            alignItems: "center",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            pointerEvents: 'auto',
             }}>
              <Typography className="font-bold text-3xl"
               sx={{

                 display: 'flex', 
                 justifyContent: 'center' , 
                 fontFamily: 'KosugiMaru-Regular, sans-serif'
                 }}
              >
              {image_name}
              </Typography>
            <Button onClick={handleCloseModal} variant="contained" color="primary" 
            sx={{
               color:'white',
               fontFamily:'BungeeShade-Regular, sans-serif',
               background:"linear-gradient(45deg, #2ca9e1, #f0908d)",
               zIndex: 1000,
               }}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
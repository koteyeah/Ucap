import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

interface DrawerComponentProps {
  children: React.ReactNode;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const Drawer: React.FC<DrawerComponentProps> = ({ children, isDrawerOpen, toggleDrawer }) => {
  const theme = useTheme();

  const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'relative',
    top: '-1.1vh',
    cursor: 'pointer',
  }));

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 上部分とドロワー全体を含むコンテナ */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: isDrawerOpen ? 'calc(50vh + 59px)' : 'calc(5vh + 59px)', // ドロワーの高さを設定
          bgcolor: 'background.paper',
          boxShadow: '0px -3px 6px rgba(0,0,0,0.2)',       
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          transition: theme.transitions.create(['height'], {
            duration: theme.transitions.duration.enteringScreen,
          }),
          zIndex: 90,
          overflow: 'hidden',
          paddingTop: '5vh',
        }}
      >
        {/* 上部分 */}
        <Box
          sx={{
            width: '100%',
            height: '5vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #ccc',
            bgcolor: 'background.paper',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            cursor: 'pointer',
            position: 'absolute',
            transition: theme.transitions.create('bottom', {
              duration: theme.transitions.duration.enteringScreen,
            }),
            bottom: isDrawerOpen ? 'calc(45vh + 59px)' : '59px', // ドロワーの中身が表示されるように移動
          }}
          onClick={toggleDrawer}
        >
          <Puller />
        </Box>
        {/* ドロワーの中身 */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '3vh',
            marginBottom: '60px',
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </div>
  );
};

export default Drawer;

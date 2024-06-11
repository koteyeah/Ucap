import Header from "../components/Header";
import Footer from "../components/Footer";
import SignUp from "../components/SignUp";
import Logo from "../components/Logo";
import { Box } from "@mui/material";
import useWindowSize from '@/src/useWindowSize';

export default function Page() {
  // const { width, height } = useWindowSize();
  // const calculatedHeight = height ? height * 0.95 : '95vh';
  return (
    <Box
      sx={{
        // height: `calc(${calculatedHeight}px - 60px)`,
        minHeight: "100vh", // Viewport height
        minWidth: "100vw", // Viewport width
        display: "flex", // Flexboxを有効にする
        justifyContent: "center", // 水平方向の中央揃え
        alignItems: "center", // 垂直方向の中央揃え
      }}
    >
      <SignUp />
      {/* コンテンツ */}
    </Box>
  );
}

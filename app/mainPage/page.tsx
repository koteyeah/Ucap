'use client';
import { Box } from "@mui/material";
import Footer from "../components/Footer";
import MultipleCards from "../components/MultiCard/MultipleCards";
import Header from "../components/Header";
import useWindowSize from '@/src/useWindowSize';

export default function Page() {
  const { width, height } = useWindowSize();
  return (
    <Box>
      {/* 専用ヘッダー */}
      <Box
        sx={{
          // position:'sticky',
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <Header />
      </Box>
      <Box sx={{height:`calc(${height}px - 60px-55px)`}}>
      <MultipleCards />
      </Box>
      {/* <SimplePopover/> */}
      {/* <FeedBack />  */}
      <Footer currentPage={"main"} />
    </Box>
  );
}

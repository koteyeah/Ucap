import SignIn from "./components/SignIn";
import { Box } from "@mui/material";

export default async function Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh", // Viewport height
        minWidth: "100vw", // Viewport width
        display: "flex", // Flexboxを有効にする
        justifyContent: "center", // 水平方向の中央揃え
        alignItems: "center", // 垂直方向の中央揃え
      }}
    >
      <SignIn />
      {/* コンテンツ */}
    </Box>
  );
}

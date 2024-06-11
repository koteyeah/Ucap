import Logo from "./Logo";
import { Box } from "@mui/system";

export default function Header() {
  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        padding: "5px",
        marginBottom: "0",
        zIndex: 100,
        height: "55px", // ヘッダーの高さを55ピクセルに設定
      }}
    >
      <img src="logo.png" style={{ height: "100%" }} />
    </Box>
  );
}

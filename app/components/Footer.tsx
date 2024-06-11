import { Box, Link } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DriveFileRenameOutlineSharpIcon from "@mui/icons-material/DriveFileRenameOutlineSharp";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
export default function Footer({ currentPage }: { currentPage: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .2)",
        padding: "0 10px",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "white",
        zIndex: 100,
      }}
    >
      <Link
        href="./mainPage"
        style={{
          padding: "5px 10px",
        }}
      >
        {currentPage == "main" ? (
          <HomeIcon style={{ color: "black", fontSize: "50px" }} />
        ) : (
          <HomeOutlinedIcon style={{ color: "black", fontSize: "50px" }} />
        )}
      </Link>
      <Link

        // href="./favoriteSpotsPage"

        href="./mySpotsPage"
        style={{
          padding: "5px 10px",
        }}
      >
        {currentPage == "spot" ? (
          <LocationOnIcon style={{ color: "black", fontSize: "50px" }} />
        ) : (
          <LocationOnOutlinedIcon
            style={{ color: "black", fontSize: "50px" }}
          />
        )}
      </Link>
      <Link
        href="./inputImagePage"
        style={{
          padding: "5px 10px",
        }}
      >
        {currentPage == "post" ? (
          <DriveFileRenameOutlineSharpIcon
            style={{ color: "black", fontSize: "50px" }}
          />
        ) : (
          <DriveFileRenameOutlineIcon
            style={{ color: "black", fontSize: "50px" }}
          />
        )}
      </Link>
      <Link
        href="./profilePage"
        style={{
          padding: "5px 10px",
        }}
      >
        {currentPage == "profile" ? (
          <PersonIcon style={{ color: "black", fontSize: "50px" }} />
        ) : (
          <PersonOutlineIcon style={{ color: "black", fontSize: "50px" }} />
        )}
      </Link>
    </Box>
  );
}

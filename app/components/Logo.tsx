import Link from "next/link";
import RoomIcon from "@mui/icons-material/Room";
import JoinLeftRoundedIcon from '@mui/icons-material/JoinLeftRounded';
import JoinFullRoundedIcon from '@mui/icons-material/JoinFullRounded';

export default function Logo() {
  return (
    <span
      style={{
        fontSize: "30px",
        fontWeight: "bold",
        color: "black",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* <JoinLeftRoundedIcon fontSize="large" style={{ marginRight: "-1px" }} /> */}
      {/* <RoomIcon fontSize="large" style={{ marginRight: "-5px" }} /> */}
      
        UCap
      <JoinFullRoundedIcon fontSize="large" style={{ marginRight: "-1px" }}/>
    </span>
  );
}

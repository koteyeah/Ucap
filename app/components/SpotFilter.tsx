"use client";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { useState } from "react";

export default function SpotFilter() {
  const [active, setActive] = useState<boolean>(false);
  return (
    <button className="p-1" onClick={() => setActive(!active)}>
      {active ? (
        <FilterListOffIcon fontSize="large" />
      ) : (
        <FilterListIcon fontSize="large" />
      )}
    </button>
  );
}

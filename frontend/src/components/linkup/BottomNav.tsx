import { useState } from "react";
import { BottomNavigation } from "./BottomNavigation";

export function BottomNav() {
  const [activeId, setActiveId] = useState("home");

  return <BottomNavigation activeId={activeId} onChange={setActiveId} />;
}

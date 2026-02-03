"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  
  return (
    <Button variant="outline" onClick={() => setIsDark(!isDark)}>
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}
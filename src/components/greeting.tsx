"use client";

import React from "react";
import { getTimeBasedGreeting } from "@/lib/utils";

interface GreetingProps {
  name?: string | null;
}

function Greeting({ name }: GreetingProps) {
  const firstName = name?.split(" ")[0] || "there";

  return (
    <h2 className="text-2xl font-bold">
      {getTimeBasedGreeting()}, {firstName}!
    </h2>
  );
}

export default Greeting;

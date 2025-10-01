"use client";

import React from "react";
import { getTimeBasedGreeting } from "@/lib/utils";

function Greeting() {
  return <h2 className="text-2xl font-bold">{getTimeBasedGreeting()}, Aaron</h2>;
}

export default Greeting;

"use client";

import { getTimeBasedGreeting } from "@/lib/utils";
import React from "react";

function Greeting() {
  return <h2 className="mb-8 text-2xl font-bold">{getTimeBasedGreeting()}, Aaron</h2>;
}

export default Greeting;

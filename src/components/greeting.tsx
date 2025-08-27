"use client";

import React from "react";
import { getTimeBasedGreeting } from "@/lib/utils";

function Greeting() {
  return <h2 className="mb-3 text-2xl font-bold md:mb-8">{getTimeBasedGreeting()}, Aaron</h2>;
}

export default Greeting;

import { Weather, getCurrentWeather } from "@/lib/weather";

import Image from "next/image";
import React from "react";

async function WeatherBar() {
  const weather: Weather = await getCurrentWeather();

  return (
    <div>
      <div className="bg-surface/80 fixed bottom-4 left-4 flex w-fit items-center gap-3 rounded-full py-1.5 pl-1.5 pr-6 shadow-lg backdrop-blur-md transition-opacity duration-300 ease-in-out hover:opacity-100">
        <Image
          width={50}
          height={50}
          alt="Weather Icon"
          className="size-15"
          src={`https:${weather.current.condition.icon}`}
        />

        <div className="flex flex-col">
          <span className="text-surface-muted text-sm font-medium">
            {weather.location.name}, {weather.location.region}
          </span>
          <span className="text-surface-muted text-xs">
            {weather.current.condition.text} - {weather.current.temp_f}°F (Feels
            like {weather.current.feelslike_f}°F)
          </span>
        </div>
      </div>
    </div>
  );
}

export default WeatherBar;

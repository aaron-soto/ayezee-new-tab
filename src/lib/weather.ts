"use server";

export type Weather = {
  current: {
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    feelslike_f: number;
    temp_f: number;
  };
  location: {
    name: string;
    region: string;
    tz_id: string;
  };
};

export async function getCurrentWeather(): Promise<Weather> {
  const ZIP_CODE = "85122";

  const res = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${ZIP_CODE}&aqi=no`,
    { next: { revalidate: 600 } },
  );

  if (!res.ok) throw new Error("Failed to fetch weather");

  return res.json();
}

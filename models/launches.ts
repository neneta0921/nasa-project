import * as log from "https://deno.land/std@0.83.0/log/mod.ts";

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchData: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}
const launches = new Map<number, Launch>();

export const downloadLaunchData = async () => {
  log.info("Downloading launch data...");
  const response = await fetch(
    "https://api.spacexdata.com/v3/launches",
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    log.warning("Problem downloading launch data.");
    throw new Error("Launch data download failed.");
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = payloads.flatMap((payload: any) => {
      return payload["customers"];
    });

    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      launchData: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
      customers: customers,
    };

    launches.set(flightData.flightNumber, flightData);
    // log.info(JSON.stringify(flightData));
  }
};

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

export const getAllLaunches = () => {
  return Array.from(launches.values());
};

export const getOneLaunch = (id: number) => {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null;
};

export const removeOneLaunch = (id: number) => {
  const aborted = launches.get(id);
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
};

export const addOneLaunch = (data: Launch) => {
  launches.set(
    data.flightNumber,
    Object.assign(data, {
      upcoming: true,
      customers: ["ZTM", "NASA"],
    }),
  );
};

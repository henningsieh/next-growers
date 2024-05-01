/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Loader,
  Paper,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import React from "react";
import { Chart } from "react-google-charts";

import { useRouter } from "next/router";

import { Locale } from "~/types";

import { api } from "~/utils/api";
import { processLightwattsData } from "~/utils/helperUtils";

interface LightWattChartOptions {
  reportStartDate: Date;
  dateOfnewestPost: Date;
}

export function LightWattChart({
  reportStartDate,
  dateOfnewestPost,
}: LightWattChartOptions) {
  const router = useRouter();
  const { locale: activeLocale } = router;

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { data: lightWatts } =
    api.lightwatts.getAllLightWattsByReportId.useQuery(
      "cluqhy9eh00002a6i6o3gf6v6"
    );

  // process data in helper function
  const processedData = processLightwattsData(lightWatts);

  if (lightWatts && processedData) {
    // Calculate ticks every fifth day between reportStartDate and dateOfnewestPost
    const ticks = [];
    const currentTick = new Date(reportStartDate);
    while (currentTick <= dateOfnewestPost) {
      ticks.push(new Date(currentTick));
      currentTick.setDate(currentTick.getDate() + 5); // Add 5 days for each tick
    }
    // Ensure dateOfnewestPost is included as the last entry in ticks if not already
    const lastTick = new Date();
    lastTick.setDate(lastTick.getDate() - 1); // Reduce by 1 day
    ticks.push(lastTick);

    // Find the highest watt value in lightWatts
    const highestWatt = lightWatts.reduce(
      (max, lightWatt) => Math.max(max, lightWatt.watt),
      0
    );

    // Calculate the upper limit for y-axis ticks by adding 100 to the highest watt value
    const yAxisUpperLimit = highestWatt + 50;

    // Generate ticks from 0 to yAxisUpperLimit
    const yAxisTicks = Array.from(
      { length: Math.ceil(yAxisUpperLimit / 50) },
      (_, index) => index * 50
    );

    const options = {
      title: "Light power during the grow",
      titleTextStyle: {
        color: theme.white, // Set the color of the title here
      },
      hAxis: {
        ticks: ticks,
        // ticks: [
        //   new Date(2024, 2, 30),
        //   new Date(2024, 3, 5),
        //   new Date(2024, 3, 10),
        //   new Date(2024, 3, 15),
        //   new Date(2024, 3, 20),
        // ],
        format: router.locale === Locale.EN ? "MM/dd" : "dd.MM.",

        title: "Date",
        titleTextStyle: {
          color: theme.white, // Set the color of the title text to white
        },
        textStyle: {
          color: theme.white, // Set the color of the yAxis values here
        },
      },
      vAxis: {
        ticks: yAxisTicks,
        title: "Watt",
        titleTextStyle: {
          color: theme.white, // Set the color of the title text to white
        },
        viewWindow: {
          min: 0, // Minimum value of the vAxis
          // Adjust the max value to extend the vAxis beyond the highest data value
          max: yAxisUpperLimit, // Example value, replace with your desired maximum value
        },
        textStyle: {
          color: theme.white, // Set the color of the yAxis values here
        },
      },
      legend: { position: "top" },
      colors: [theme.colors.yellow[5]], // Set the line color here

      chartArea: { backgroundColor: theme.white },
      height: 360,
      backgroundColor: theme.colors.dark[7],
    };

    return (
      processedData && (
        <Paper
          withBorder
          sx={(theme) => ({
            overflow: "hidden",
            borderRadius: theme.radius.sm,
          })}
        >
          <Chart
            chartType="SteppedAreaChart"
            // height="400px"
            data={[
              ["Date", "Watt"],
              ...processedData.map(({ date, watt }) => [date, watt]),
            ]}
            options={options}
          />
        </Paper>
      )
    );
  }
}
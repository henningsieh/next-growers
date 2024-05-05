// pages/api/getAllBreeders.tsx
// import fetch from "node-fetch"; // Import fetch to make HTTP requests
import type { NextApiRequest, NextApiResponse } from "next";

// Define a type for the response object
export type BreedersResponse = {
  [key: string]: {
    name: string;
    logo: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch data from the public API
    const response = await fetch(
      "https://en.seedfinder.eu/api/json/ids.json?br=all&strains=0&ac=d8fe19486b31da9dbb7a01ee67798991"
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }

    // Parse the JSON response using type assertion
    const data = (await response.json()) as BreedersResponse;

    // Return the data as JSON
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// pages/api/resolveAmazonUrl.tsx
import { tall } from "tall";
import * as url from "url";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { shortenedUrl, newTag } = req.query;

    // Ensure both shortenedUrl and newTag are provided
    if (!shortenedUrl || !newTag) {
      return res
        .status(400)
        .json({ error: "Both shortenedUrl and newTag are required." });
    }

    const resolvedUrl = await resolveAndSetTag(
      shortenedUrl.toString(),
      newTag.toString()
    );

    return res.status(200).json({ resolvedUrl });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function resolveAndSetTag(
  shortenedUrl: string,
  newTag: string,
  maxRetries = 20 // Maximum number of retries
) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Resolve the shortened URL using the tall package
      const unshortenedUrl = await tall(shortenedUrl);

      // Parse the resolved URL
      const parsedUrl = new url.URL(unshortenedUrl);

      // Update the 'tag' query parameter with the new tag value
      parsedUrl.searchParams.set("tag", newTag);

      // Remove unwanted query parameters
      parsedUrl.searchParams.delete("th");
      parsedUrl.searchParams.delete("ref_");
      parsedUrl.searchParams.delete("linkId");
      parsedUrl.searchParams.delete("linkCode");

      // Return the updated URL
      return parsedUrl.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Log the error
        console.error(`Error resolving URL: ${error.message}`);

        // Increment the retry count
        retryCount++;

        // Delay before retrying (optional)
        await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for 200 milliseconds before retrying
      } else {
        // If error is not an instance of Error, throw it again
        throw error;
      }
    }
  }

  // If all retries fail, throw an error
  throw new Error("Exceeded maximum number of retries");
}

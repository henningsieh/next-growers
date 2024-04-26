// pages/api/resolveAmazonUrl.ts
import axios, { AxiosError, AxiosResponse } from "axios";
import * as querystring from "querystring";
import * as url from "url";

import { NextApiRequest, NextApiResponse } from "next";

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
): Promise<string> {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Send a GET request to the shortened URL
      const response = await axios.get(shortenedUrl, {
        maxRedirects: 5,
        validateStatus: (status) => status < 500, // Do not treat 5xx status codes as errors
      });

      // Extract the resolved URL from the response headers
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const resolvedUrl = response.request.res.responseUrl;

      // Parse the resolved URL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const parsedUrl = new url.URL(resolvedUrl);

      // Update the 'tag' query parameter with the new tag value
      parsedUrl.searchParams.set("tag", newTag);

      // Remove the 'linkId' query parameter
      parsedUrl.searchParams.delete("th");
      parsedUrl.searchParams.delete("ref_");
      parsedUrl.searchParams.delete("linkId");
      parsedUrl.searchParams.delete("linkCode");

      // Return the updated URL
      return parsedUrl.toString();
    } catch (error: any) {
      // Log the error
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
      console.error(`Error resolving URL: ${error.message}`);

      // Increment the retry count
      retryCount++;

      // Delay before retrying (optional)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }
  }

  // If all retries fail, throw an error
  throw new Error("Exceeded maximum number of retries");
}

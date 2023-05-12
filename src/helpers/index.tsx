/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Dispatch, SetStateAction } from "react";
import type { ImageUploadResponse, Locale, Report } from "~/types";

import axios from "axios";

export function getUsername(): string {
  const usernames: string[] = [
    "Green Thumb",
    "Garden Guru",
    "Plant Parent",
    "Botanical Boss",
    "Harvest Hero",
    "Flower Fanatic",
    "The Plant Professor",
    "Nature Ninja",
    "Seed Sower",
    "Leaf Lover",
    "Plant Whisperer",
    "The Garden Sage",
    "Farm Fresh",
    "Bloom Buddy",
    "Sprout Supreme",
    "Botany Buff",
    "The Garden Gnome",
    "Root Ruler",
    "Hydroponic Hero",
    "The Plant Doctor",
    "Cultivate King",
    "Vegetable Veteran",
    "Agriculture Ace",
    "Gardening Guru",
    "The Plant Queen",
    "Succulent Savior",
    "Compost King",
    "Green Goddess",
    "Garden Guardian",
    "Herb Hunter",
    "Orchid Obsessed",
    "Crop Commander",
    "Indoor Gardener",
    "The Garden Fairy",
    "Foliage Fan",
    "Plant Protector",
    "Lawn Legend",
    "Flower Farmer",
    "The Plant Enthusiast",
    "Organic Overlord",
    "Horticulture Hero",
    "Terrarium Tamer",
    "Bonsai Boss",
    "The Garden Wizard",
    "Agro Ace",
    "Greenhouse Genius",
    "The Plant Addict",
    "Perennial Pro",
    "Urban Farmer",
    "Cactus Cowboy",
    "Tulip Tamer",
    "Sage of Succulents",
    "Bamboo Boss",
    "Mighty Mulcher",
    "Fern Fanatic",
    "Tree Whisperer",
    "Flower Fury",
    "Petal Pusher",
    "Hedge Hero",
    "Weed Warrior",
    "Beekeeper",
    "Rose Ruler",
    "Gardening God",
    "Pepper Picker",
    "Aloe Ambassador",
    "Tiller Titan",
    "Vegetable Vigilante",
    "Fruit Fiend",
    "Pumpkin Pro",
    "Water Wizard",
    "The Soil Savant",
    "Squash Squasher",
    "Radish Ringleader",
    "Gardening Gladiator",
    "The Garden Crusader",
    "The Garden General",
    "The Garden Warrior",
    "Gardening Goliath",
    "Gardening Giant",
    "Gardening Gladiator",
    "The Garden Legend",
    "Gardening Guardian",
    "The Garden Superhero",
    "Gardening Guru",
    "Gardening Genius",
    "The Garden Magician",
    "Gardening Maestro",
    "Gardening Maverick",
    "The Garden Sage",
    "Gardening Sensation",
    "The Garden Virtuoso",
    "Gardening Whiz",
    "Gardening Wizard",
    "The Garden Wizard",
    "Green Guardian",
    "Gardening Guru",
    "Hoe Hero",
    "The Hoer",
    "Hosemaster",
    "Hose Handler",
    "Pruner Prodigy",
    "Pruning Pro",
    "The Pruner",
    "Secateur Savant",
    "Snipper Superstar",
    "Snipping Specialist",
    "The Shearer",
    "Garden Shear Genius",
    "The Hedge Clipper",
    "Weed Warrior",
    "The Weed Whacker",
    "Weed Whipping Wonder",
  ];

  const randomIndex = Math.floor(Math.random() * usernames.length);
  return usernames[randomIndex] as string;
}

export function getEmailaddress(): string {
  const emailAddresses: string[] = [
    "plantdad@hotmail.com",
    "greenthumb@outlook.com",
    "crazyplantlady@gmail.com",
    "botanicalboss@yahoo.com",
    "gardeningguru@aol.com",
    "theplantprofessor@mail.com",
    "bloommaster@protonmail.com",
    "gardenenthusiast@icloud.com",
    "seed.sower@mail.com",
    "succulentqueen@outlook.com",
    "horticulturehero@protonmail.com",
    "veggievixen@gmail.com",
    "orchidobsessed@yahoo.com",
    "thegardensage@hotmail.com",
    "leaflover@icloud.com",
    "flowerfanatic@outlook.com",
    "plantwhisperer@gmail.com",
    "compostking@mail.com",
    "theplantdoctor@icloud.com",
    "plantdadjr@gmail.com",
  ];

  const randomIndex = Math.floor(Math.random() * emailAddresses.length);
  return emailAddresses[randomIndex] as string;
}

export const handleDrop = async (
  files: File[],
  setImageId: Dispatch<SetStateAction<string>>,
  setImagePublicId: Dispatch<SetStateAction<string>>,
  setCloudUrl: Dispatch<SetStateAction<string>>,
  setIsUploading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  const formData = new FormData();
  console.log("src\\helpers\\handleDrop:", files);
  if (files && files[0]) {
    // files.map((file) => formData.append("image", file));
    formData.append("image", files[0]); // Assuming only one file is uploaded
    try {
      const { data }: { data: ImageUploadResponse } = await axios.post(
        "/api/upload",
        formData
      );

      if (data.success) {
        console.log("File uploaded successfully");
        // setting the image informations to the component state
        setImageId(data.imageId);
        setImagePublicId(data.imagePublicId);
        setCloudUrl(data.cloudUrl);

        setIsUploading(false);
      } else {
        throw new Error("File uploaded NOT successfully");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error uploading file");
    }
  }
};

export function stringifyReportData(report: any): Report {
  return {
    id: report?.id,
    imagePublicId: report?.image?.publicId,
    imageCloudUrl: report?.image?.cloudUrl,
    title: report?.title,
    description: report?.description,
    authorId: report?.author?.id,
    authorName: report?.author?.name,
    authorImage: report?.author?.image,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    createdAt: report?.createdAt?.toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    updatedAt: report?.updatedAt?.toISOString(),
  };
}

export function sanatizeDateString(originalDateString: string, locale: Locale) {
  const reportStartDate = new Date(originalDateString);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
  };

  if (locale === "en") {
    // intl. date
    const intlFormatter = new Intl.DateTimeFormat("en-US", options);
    const intlDate = intlFormatter.format(reportStartDate); // "May 11, 2023"
    console.log(intlDate);
    return intlDate;
  } else {
    // german date
    const germanFormatter = new Intl.DateTimeFormat("de-DE", options);
    const germanDate = germanFormatter.format(reportStartDate); // "11. Mai 2023"
    console.log(germanDate);
    return germanDate;
  }
}

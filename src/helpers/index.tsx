import axios from "axios";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";

import type {
  ImageUploadResponse,
  IsoReportWithPostsFromDb,
  Locale,
  MultiUploadResponse,
  Notification,
  SplitObject,
} from "~/types";

// export function getKeyByValue<T extends string>(
//   object: Record<string, T>,
//   value: T
// ): keyof typeof object | undefined {
//   return Object.keys(object).find(
//     (key) => object[key] === value
//   ) as keyof typeof object;
// }

export function hasUnreadNotifications(
  notifications: Notification[]
): boolean {
  return (
    notifications &&
    notifications.some((notification) => notification.readAt === null)
  );
}

export function splitSearchString(searchString: string): SplitObject {
  const splitObject: SplitObject = {
    strain: "",
    searchstring: "",
  };

  if (searchString.includes("strain:")) {
    const regex = /strain:"([^"]*)"|strain:([^ ]*)/i;
    const matches = searchString.match(regex);

    if (matches) {
      const strainValue = matches[1] || matches[2];
      const searchstring = searchString.replace(matches[0], "").trim();
      splitObject.strain = strainValue?.trim() ?? "";
      splitObject.searchstring = searchstring;
    } else {
      splitObject.searchstring = searchString;
    }
  } else {
    splitObject.searchstring = searchString;
  }

  return splitObject;
}

export const handleSearchChange = (
  event: ChangeEvent<HTMLInputElement>,
  setSearchString: Dispatch<SetStateAction<string>>
) => {
  setSearchString(event.target.value);
};

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
  return usernames[randomIndex];
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
  return emailAddresses[randomIndex];
}

export function sanatizeDateString(
  originalDateString: string,
  locale: Locale,
  withTime: boolean
) {
  const reportStartDate = new Date(originalDateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: withTime ? "numeric" : undefined,
    minute: withTime ? "numeric" : undefined,

    // hour12: false,
  };

  if (locale === "en") {
    // intl. date
    const intlFormatter = new Intl.DateTimeFormat("en-US", options);
    const intlDate = intlFormatter.format(reportStartDate); // "May 11, 2023"
    // console.debug(intlDate);
    return intlDate;
  } else {
    // german date
    const germanFormatter = new Intl.DateTimeFormat("de-DE", options);
    const germanDate = germanFormatter.format(reportStartDate); // "11. Mai 2023"
    const germanTime = withTime ? ` Uhr` : "";
    const formattedDate = `${germanDate}${germanTime}`;
    // console.debug(formattedDate);
    return formattedDate;
  }
}

export const handleDrop = async (
  files: File[],
  setImageId: Dispatch<SetStateAction<string>>,
  setImagePublicId: Dispatch<SetStateAction<string>>,
  setCloudUrl: Dispatch<SetStateAction<string>>,
  setIsUploading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  const formData = new FormData();

  if (files && files[0]) {
    formData.append("image", files[0]); // Assuming only one file is uploaded
    try {
      const { data }: { data: ImageUploadResponse } = await axios.post(
        "/api/upload",
        formData
      );

      if (data.success) {
        console.debug("File uploaded successfully", data);
        // setting the image informations to the component state
        setImageId(data.imageId);
        setImagePublicId(data.imagePublicId);
        setCloudUrl(data.cloudUrl);

        setIsUploading(false);
      } else {
        setIsUploading(false);
        throw new Error("Server Error 500: upload failed");
      }
    } catch (error) {
      setIsUploading(false);
      console.debug(error);
      throw new Error("Error uploading file");
    }
  }
};

export const handleMultipleDrop = async (
  files: File[],
  report: IsoReportWithPostsFromDb,
  setImageIds: Dispatch<SetStateAction<string[]>>,
  setImagePublicIds: Dispatch<SetStateAction<string[]>>,
  setCloudUrls: Dispatch<SetStateAction<string[]>>,
  setIsUploading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  try {
    setIsUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("images", file, `${file.name}`);
      formData.append("ownerId", report.authorId as string);

      const { data }: { data: MultiUploadResponse } = await axios.post(
        "/api/multiple-upload",
        formData
      );

      if (data.success) {
        // Add the image information to the component state
        setImageIds((prevImageIds) => [
          ...prevImageIds,
          ...data.imageIds,
        ]);
        setImagePublicIds((prevImagePublicIds) => [
          ...prevImagePublicIds,
          ...data.imagePublicIds,
        ]);
        setCloudUrls((prevCloudUrls) => [
          ...prevCloudUrls,
          ...data.cloudUrls,
        ]);
      } else {
        throw new Error("File uploaded NOT successfully");
      }
    }

    setIsUploading(false);
  } catch (error) {
    console.debug(error);
    throw new Error("Error uploading file");
  }
};

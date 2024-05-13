import type { AppRouter } from "./server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

import type { Dispatch, SetStateAction } from "react";

import type { User } from "next-auth";

type RouterOutput = inferRouterOutputs<AppRouter>;

type GetIsoReportWithPostsFromDbOutput =
  RouterOutput["reports"]["getIsoReportWithPostsFromDb"];
export type IsoReportWithPostsFromDb =
  GetIsoReportWithPostsFromDbOutput;
export interface IsoReportCardProps {
  report: IsoReportWithPostsFromDb;
  setSearchString?: Dispatch<SetStateAction<string>>;
}

type getPostsByReportIdOutput =
  RouterOutput["posts"]["getPostsByReportId"];
export type Posts = getPostsByReportIdOutput;
export type Post = getPostsByReportIdOutput[number];

type getCommentsByPostIdOutput =
  RouterOutput["comments"]["getCommentsByPostId"];
export type Comments = getCommentsByPostIdOutput;
export type Comment = getCommentsByPostIdOutput[number];

type getAllNotificationsOutput =
  RouterOutput["notifications"]["getNotificationsByUserId"];
export type Notifications = getAllNotificationsOutput;
export type Notification = getAllNotificationsOutput[number];

type getAllStrainsOutput = RouterOutput["strains"]["getAllStrains"];
export type Strains = getAllStrainsOutput;
export type Strain = getAllStrainsOutput[number];

type getLikesByItemIdOutput = RouterOutput["like"]["getLikesByItemId"];
export type Likes = getLikesByItemIdOutput;
export type Like = getLikesByItemIdOutput[number];

export interface EditReportFormProps {
  user: User;
  report: IsoReportWithPostsFromDb;
  strains: Strains | undefined;
}

export interface ImageUploadResponse {
  success: boolean;
  imageId: string;
  imagePublicId: string;
  cloudUrl: string;
}

export interface MultiUploadResponse {
  success: boolean;
  imageIds: string[];
  imagePublicIds: string[];
  cloudUrls: string[];
}

export interface SortingPanelProps {
  desc: boolean;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  handleToggleDesc: () => void;
}

export interface FakeCardBadgeProps {
  country: string;
  badges: {
    emoji: string;
    label: string;
  }[];
}

export interface SplitObject {
  strain: string;
  searchstring: string;
}

export type NotificationEventMap =
  | "REPORT_CREATED" //TODO: NOTIFY user.followers
  | "POST_CREATED" //TODO: NOTIFY report.followers
  | "LIKE_CREATED"
  | "COMMENT_CREATED"
  | "COMMENT_ANSWERED";

export enum Locale {
  EN = "en",
  DE = "de",
}

export enum GrowStage {
  PREPARATION_STAGE = "Preparation",
  GERMINANTION_STAGE = "Germination",
  SEEDLING_STAGE = "Seedling",
  VEGETATIVE_STAGE = "Vegetative ",
  FLOWERING_STAGE = "Flowering",
  HARVEST_STAGE = "Harvest",
  CURING_STAGE = "Curing",
}

export enum Environment {
  INDOOR = "Indoor 💡",
  OUTDOOR = "Outdoor 🌦️",
}

export type MantineSelectData = { value: string; label: string }[];

export interface LightswattsDataPoint {
  date: Date;
  watt: number;
}

export type BreederFromSeedfinder = {
  name: string;
  logo: string;
  strains: StrainFromSeedfinder;
};

export type BreedersResponse = {
  [breederName: string]: BreederFromSeedfinder;
};

export type StrainFromSeedfinder = {
  [strainName: string]: string;
};

export type StrainInfoFromSeedfinder = {
  error: boolean;
  id: string;
  name: string;
  brinfo: {
    id: string;
    name: string;
    type: string;
    cbd: string;
    descr: string;
    description: string;
    link: string;
    pic: string;
    flowering: {
      auto: boolean;
      days: number;
      info: string;
    };
  };
  comments: boolean;
  links: {
    info: string;
    review: string;
    upload: {
      picture: string;
      review: string;
      medical: string;
    };
  };
  licence: {
    url_cc: string;
    url_sf: string;
    info: string;
  };
};

//NOT USED
export type Plant = {
  id: string;
  reportId: string;
  seedfinderStrainId: string;
  plantName: string;
  seedfinderStrain: {
    id: string;
    strainId: string;
    name: string;
    type: string;
    cbd: string;
    description: string;
    flowering_days: number;
    flowering_info: string;
    flowering_automatic: boolean;
    seedfinder_ext_url: string;
    breederId: string;
    breeder_name: string;
    breeder_description: string;
    breeder_website_url: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

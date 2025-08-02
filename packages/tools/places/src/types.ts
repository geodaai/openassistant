// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';

/**
 * Common interfaces shared between placeSearch and geoTagging tools
 */

export interface FoursquareTip {
  id: string;
  created_at: string;
  text: string;
  url: string;
  lang: string;
  agree_count: number;
  disagree_count: number;
}

export interface FoursquarePhoto {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
  classifications?: string[];
  tip?: FoursquareTip;
}

export interface FoursquareIcon {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
  classifications?: string[];
  tip?: FoursquareTip;
}

export interface FoursquareCategory {
  fsq_category_id: string;
  name: string;
  short_name?: string;
  plural_name?: string;
  icon: FoursquareIcon;
}

export interface FoursquareChain {
  fsq_chain_id: string;
  name: string;
  logo?: FoursquareIcon;
  parent_id?: string;
}

export interface FoursquareLocation {
  address?: string;
  locality?: string;
  region?: string;
  postcode?: string;
  admin_region?: string;
  post_town?: string;
  po_box?: string;
  country?: string;
  formatted_address?: string;
}

export interface FoursquareExtendedLocation {
  dma?: string;
  census_block_id?: string;
}

export interface FoursquareAttributes {
  restroom?: boolean;
  outdoor_seating?: boolean;
  atm?: boolean;
  has_parking?: boolean;
  wifi?: string;
  delivery?: boolean;
  reservations?: boolean;
  takes_credit_card?: boolean;
}

export interface FoursquareHoursRegular {
  close: string;
  day: number;
  open: string;
}

export interface FoursquareHours {
  display?: string;
  is_local_holiday?: boolean;
  open_now?: boolean;
  regular?: FoursquareHoursRegular[];
}

export interface FoursquareSocialMedia {
  facebook_id?: string;
  instagram?: string;
  twitter?: string;
}

export interface FoursquareStats {
  total_photos: number;
  total_ratings: number;
  total_tips: number;
}

export interface FoursquareTipExtended extends FoursquareTip {
  fsq_tip_id: string;
  photo?: FoursquarePhoto;
}

export interface FoursquarePhotoExtendedTip {
  fsq_tip_id: string;
  created_at: string;
  text: string;
  url: string;
  photo?: FoursquarePhoto;
  lang: string;
  agree_count: number;
  disagree_count: number;
}

export interface FoursquarePhotoExtended {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
  classifications?: string[];
  fsq_photo_id: string;
  tip?: FoursquarePhotoExtendedTip;
}

export interface FoursquareGeoBounds {
  circle: {
    center: {
      latitude: number;
      longitude: number;
    };
    radius: number;
  };
}

export interface FoursquareGeoBoundsOptional {
  circle?: {
    center: {
      latitude: number;
      longitude: number;
    };
    radius: number;
  };
}

export interface FoursquareContext {
  geo_bounds: FoursquareGeoBounds;
}

export interface FoursquareContextOptional {
  geo_bounds?: FoursquareGeoBoundsOptional;
}

// Base interface for common place properties
export interface FoursquarePlaceBase {
  fsq_place_id: string;
  latitude: number;
  longitude: number;
  name: string;
  categories: FoursquareCategory[];
  chains?: FoursquareChain[];
  date_closed?: string;
  date_created?: string;
  date_refreshed?: string;
  description?: string;
  distance?: number;
  email?: string;
  extended_location?: FoursquareExtendedLocation;
  attributes?: FoursquareAttributes;
  hours?: FoursquareHours;
  hours_popular?: FoursquareHoursRegular[];
  link?: string;
  location: FoursquareLocation;
  menu?: string;
  popularity?: number;
  placemaker_url?: string;
  price?: number;
  rating?: number;
  social_media?: FoursquareSocialMedia;
  stats?: FoursquareStats;
  store_id?: string;
  tastes?: string[];
  tel?: string;
  verified?: boolean;
  website?: string;
}

// Optimized types for place search results
export interface PlaceSearchResult {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    icon?: string;
  }>;
  chains?: Array<{
    id: string;
    name: string;
    logo?: string;
  }>;
  distance?: number;
  phone?: string;
  website?: string;
  rating?: number;
  price?: number;
  hours?: unknown;
  description?: string;
  email?: string;
  attributes?: unknown;
  photos?: Array<{
    id: string;
    url: string;
  }>;
  popularity?: number;
  verified?: boolean;
  socialMedia?: unknown;
  stats?: unknown;
  tastes?: unknown;
  tips?: unknown;
  dateCreated?: string;
  dateRefreshed?: string;
  dateClosed?: string;
  extendedLocation?: unknown;
  hoursPopular?: unknown;
  link?: string;
  menu?: unknown;
  placemakerUrl?: string;
  storeId?: string;
  relatedPlaces?: unknown;
}

// Optimized search metadata type
export interface PlaceSearchMetadata {
  query?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  near?: string;
  categories?: string[];
  chains?: string[];
  exclude_chains?: string[];
  exclude_all_chains?: boolean;
  min_price?: number;
  max_price?: number;
  open_at?: string;
  open_now?: boolean;
  sort?: string;
}


// Common coordinate types
export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface LocationWithRadius extends Coordinate {
  radius?: number;
}

// Shared Zod schemas
export const coordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const locationWithRadiusSchema = coordinateSchema.extend({
  radius: z.number().optional(),
});

export const neSwSchema = coordinateSchema;
export const polygonPointSchema = coordinateSchema; 
// To parse this data:
//
//   import { Convert, RawgGame } from "./file";
//
//   const rawgGame = Convert.toRawgGame(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface RawgGame {
    id:                          number;
    slug:                        string;
    name:                        string;
    name_original:               string;
    description:                 string;
    metacritic:                  null;
    metacritic_platforms:        any[];
    released:                    Date;
    background_image:            string;
    background_image_additional: string;
    website:                     string;
    rating:                      number;
    rating_top:                  number;
    ratings:                     any[];
    saturated_color:             string;
    dominant_color:              string;
    parent_platforms:            ParentPlatform[];
    platforms:                   PlatformElement[];
    genres:                      Developer[];
    tags:                        Developer[];
    esrb_rating:                 null;
    description_raw:             string;
}

export interface AddedByStatus {
    owned: number;
}

export interface Developer {
    id:               number;
    name:             string;
    slug:             string;
    games_count:      number;
    image_background: string;
    domain?:          string;
    language?:        Language;
}

export enum Language {
    Eng = "eng",
}

export interface ParentPlatform {
    platform: ParentPlatformPlatform;
}

export interface ParentPlatformPlatform {
    id:   number;
    name: string;
    slug: string;
}

export interface PlatformElement {
    platform:     PlatformPlatform;
    released_at:  Date;
    requirements: Requirements;
}

export interface PlatformPlatform {
    id:               number;
    name:             string;
    slug:             string;
    image:            null;
    year_end:         null;
    year_start:       null;
    games_count:      number;
    image_background: string;
}

export interface Requirements {
    minimum:     string;
    recommended: string;
}

export interface Store {
    id:    number;
    url:   string;
    store: Developer;
}



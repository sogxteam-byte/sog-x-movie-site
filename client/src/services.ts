// import dotenv from "dotenv";
// dotenv.config()

import axios from "axios";

let URI= import.meta.env.VITE_BACKEND  
let HF_TOKEN= import.meta.env.VITE_TOKEN

// console.log(URI)

export const api = axios.create({baseURL: URI,
    headers: {
        accept: "application/json",
        Authorization: HF_TOKEN ? `Bearer ${HF_TOKEN}` : "",
    }
})

interface Genre {
  id: number;
  name: string;
}

// Define types for videos
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}

interface prodCompany {
  id: number;
  logo_path: string | null;
  name: string;
  original_country: string;
}

export interface Movies {
  id: number;
  title: string;
  status:string
  runtime:number;
  tagline: string;
  production_companies:prodCompany[];
  overview:string;
  original_title:string;
  budget:string;
  revenue:string;
  genres: Genre[];
  poster_path:string | null;
  backdrop_path:string;
  vote_average:number;
  original_language:string;
  release_date:string;
}




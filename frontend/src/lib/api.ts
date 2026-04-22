import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  department: string;
  semester: string;
  role: "student" | "moderator" | "admin";
  xp: number;
  level: number;
  badges: string[];
  avatar: string;
  bio?: string;
  savedNotes: string[];
  _id: string;
  socials?: {
    instagram: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    contact: string;
  };
  lastLogin?: string | null;
  streakCount: number;
};


export type AuthPayload = {
  name?: string;
  email?: string;
  username?: string;
  identifier?: string;
  password: string;
  department?: string;
  semester?: string;
};

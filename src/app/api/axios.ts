import axios from "axios";
import { getBaseUrl } from "@/utils/Helpers";
export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

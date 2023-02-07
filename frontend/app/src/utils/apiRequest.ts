import axios from "axios";

const baseUrl = "http://localhost:3000";
export const frontendUrl = "http://localhost:5173";

interface ConfigOptions {
  headers?: object;
  data?: object | File;
}

export async function apiRequest(
  url: string,
  method: string,
  configOptions?: ConfigOptions
) {
  const basicConfig = {
    url: url,
    method: method,
    baseurl: baseUrl,
  };
  const config = {
    ...basicConfig,
    ...configOptions,
  };
  return await axios(baseUrl + url, config);
}

export default apiRequest;

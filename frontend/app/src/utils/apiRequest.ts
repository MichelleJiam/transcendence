import axios from "axios";

const domain = "localhost";

export const baseUrl = "http://" + domain + ":3000";
export const frontendUrl = "http://" + domain + ":5173";
axios.defaults.withCredentials = true; // allows auth cookies to be passed to backend

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

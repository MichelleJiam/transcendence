import axios from "axios";

const baseUrl = "http://localhost:3000";
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

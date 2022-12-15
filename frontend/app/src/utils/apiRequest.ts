import axios from "axios";

const baseUrl = "http://localhost:3000";

export async function apiRequest(url: string, method: string) {
  const config = {
    url: url,
    method: method,
    baseurl: baseUrl,
  };
  return await axios(baseUrl + url, config);
}

export async function apiRequestBody(
  url: string,
  method: string,
  body: object
) {
  const config = {
    url: url,
    method: method,
    baseurl: baseUrl,
    headers: { "Content-Type": "application/json" },
    data: body,
  };
  return await axios(baseUrl + url, config);
}

export async function apiRequestFormData(
  url: string,
  method: string,
  body: FormData
) {
  const config = {
    url: url,
    method: method,
    baseurl: baseUrl,
    data: body,
  };
  return await axios(baseUrl + url, config);
}

export default apiRequest;

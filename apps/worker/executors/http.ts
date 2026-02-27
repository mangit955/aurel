import axios from "axios";
import { AxiosRequestConfig } from "axios";

export async function httpExecutor(node: any, input: any) {
  const url = node.data?.url;
  const method = node.data?.method || "GET"; // ✅ default
  const headers = node.data?.headers;
  const body = node.data?.body;

  console.log("HTTP node data:", node.data);

  if (!url) {
    throw new Error("URL is missing in HTTP node");
  }

  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      data: body,
      timeout: 10000,
      validateStatus: () => true,
    };

    const response = await axios(config);

    if (response.status >= 400) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return {
      status: "success",
      data: response.data,
      httpStatus: response.status,
    };
  } catch (error: any) {
    throw new Error(error.message); // ✅ always throw
  }
}

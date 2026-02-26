import axios, { AxiosRequestConfig } from "axios";

export async function httpExecutor(node: any, input: any) {
  const { method, url, headers, body } = node.data;

  try {
    //Build axios config
    const config: AxiosRequestConfig = {
      method: method as any,
      url,
      headers,
      data: body,
      timeout: 10000,
      validateStatus: (status) => true,
    };

    const response = await axios(config);

    if (response.status >= 400) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    return {
      status: "success",
      data: {
        status: response.status,
        data: response.data,
        headers: response.headers,
      },
    };
  } catch (error: any) {
    if (error.response) {
      return {
        status: "failed",
        error: "NO response received from server",
      };
    } else {
      return {
        status: "failed",
        error: error.message,
      };
    }
  }
}

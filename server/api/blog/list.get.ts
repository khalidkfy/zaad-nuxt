import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";

import categsData from "~~/server/data/categs.json";

export default defineEventHandler(async (event) => {
  // Retrieve user-agent from headers using getRequestHeaders
  // const headers = getRequestHeaders(event);

  // await requireAuth(event);

  // const userAgent = headers["user-agent"] || null;

  const query = getQuery(event);

  const body: any = query;
  // Call the API endpoint with the updated body

  const apiServie = new HttpService(event);

  try {
    const data = apiServie
      .get({
        url: "api/blog/list",
        body: body,
        // headers: headers,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    return data;
  } catch (err) {
    console.warn("API offline → loading local fallback JSON", err);

    return categsData
  }
});

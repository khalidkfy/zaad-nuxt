import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";

import page1Data from "~~/server/data/pages/page1.json";

export default defineEventHandler(async (event) => {
  // Retrieve user-agent from headers using getRequestHeaders
  const headers = getRequestHeaders(event);

  // await requireAuth(event);

  const userAgent = headers["user-agent"] || null;

  const query = getQuery(event);

  const body: any = [];
  // Call the API endpoint with the updated body
//  return page1Data;
  const apiService = new HttpService(event);
  try {
    // Try online API first
    return await apiService.get({
      url: "api/pages/1",
      body: [],
      headers,
    });
  } catch (err) {
    console.warn("API offline → loading local fallback JSON", err);

    // Path to the fallback file
    return page1Data;
  }
});

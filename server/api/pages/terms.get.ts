import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";

export default defineEventHandler(async (event) => {
  // Retrieve user-agent from headers using getRequestHeaders
  const headers = getRequestHeaders(event);

  // await requireAuth(event);

  const userAgent = headers["user-agent"] || null;

  const query = getQuery(event);

  const body: any = [];
  const apiService = new HttpService(event);
  try {
    // Try online API first
    const res = await apiService.get({
      url: "api/pages/201",
      body: [],
      headers,
    });

    return res;
  } catch (err) {
    console.warn("API offline → loading local fallback JSON", err);
  }
});

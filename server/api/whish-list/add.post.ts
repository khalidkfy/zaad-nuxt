import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  // Retrieve user-agent from headers using getRequestHeaders
  const headers = getRequestHeaders(event);

  // await requireAuth(event);

  const userAgent = headers["user-agent"] || null;

  // const query = getQuery(event);

  const body = await readBody(event);
  // Call the API endpoint with the updated body
  
  const apiServie = new HttpService(event);

  try {
    const data = apiServie
      .post({
        url: `api/favorite/items`,
        body: body,
        headers: headers,
      })
      .then((res) => {
        console.log("res => ", res);
        
        return res;
      })
      .catch((err) => {
        console.log("err => ", err);
        return err;
      });

    return data;
  } catch (err) {
    console.warn("API offline → loading local fallback JSON");
  }
});

import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";

export default defineEventHandler(async (event) => {
  // Retrieve user-agent from headers using getRequestHeaders
  // const headers = getRequestHeaders(event);

  // await requireAuth(event);

  // const userAgent = headers["user-agent"] || null;

  const query = getQuery(event);

  const body = await readBody(event);

  // Call the API endpoint with the updated body

  const apiServie = new HttpService(event);

  try {
    const data = apiServie
      .post({
        url: "api/auth/login",
        body: body,
        // headers: headers,
      })
      .then(async (res) => {
        await setUserSession(event, {
          user: {
            email: res?.user.email,
            image: res?.user.image,
            mobile: res?.user.mobile,
            mobile_verified_at: res?.user.mobile_verified_at,
            name: res?.user.name,
          },
          access_token: res?.access_token,
        });

        return res;
      })
      .catch((err) => {
        console.log("err, =>", err);
        
        return err;
      });

    return data;
  } catch (err) {
    console.warn("API offline → Faild");
  }
});

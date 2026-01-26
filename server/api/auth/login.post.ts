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
    const userData = {};
    const data = apiServie
      .post({
        url: "api/auth/login",
        body: body,
        // headers: headers,
      })
      .then(async (res) => {
        const config = useRuntimeConfig();
        const api_prefix = config.apiBase;

        // const profileData = await $fetch(`${api_prefix}/api/profile`, {
        //   method: "GET",
        //   headers: {
        //     Accept: "application/json",
        //     Authorization: res?.access_token ? `Bearer ${res?.access_token}` : "",
        //   },
        // });
        // const addresses = profileData?.resource?.addresses || [];
        // TODO HANDLE MAIN ADDRESS API

        await setUserSession(event, {
          user: {
            email: res?.user.email,
            image: res?.user.image,
            mobile: res?.user.mobile,
            mobile_verified_at: res?.user.mobile_verified_at,
            name: res?.user.name,
            // addresses: addresses
          },
          access_token: res?.access_token,
        });
        console.log(res);
        return res;
          
      })
      .catch((err) => {
        console.log(err);
        

        return err;
      });

    return data;
  } catch (err) {
    console.warn("API offline → Faild");
  }
});

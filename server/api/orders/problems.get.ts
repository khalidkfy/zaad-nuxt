import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";


export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event);

    const { user } = await requireUserSession(event);

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }


    const query = getQuery(event);

    const body: any = query;
    // Call the API endpoint with the updated body

    const apiServie = new HttpService(event);

    try {
        const data = apiServie
            .get({
                url: "api/dispute/problems",
                body: body,
                headers: headers,

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

    }
});

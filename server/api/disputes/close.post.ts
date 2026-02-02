import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event);

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    }

    const headers = getRequestHeaders(event);


    const body = await readBody(event);
    // Call the API endpoint with the updated body

    const apiServie = new HttpService(event);

    try {
        const data = apiServie
            .post({
                url: `api/dispute/close/${body.disputeId}`,
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

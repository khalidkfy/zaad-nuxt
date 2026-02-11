import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3
import { HttpService } from "@@/server/services/http-service";


export default defineEventHandler(async (event) => {
    // Retrieve user-agent from headers using getRequestHeaders
    const headers = getRequestHeaders(event);

    // await requireAuth(event);

    // const userAgent = headers["user-agent"] || null;

    const query = getQuery(event);

    const body: any = query;
    // Call the API endpoint with the updated body

    const apiServie = new HttpService(event);

    try {
        const data = await apiServie.get({
            url: `api/item/${body?.item_id}/rates`,
            body,
            headers,
        });

        if (!data) {
            throw createError({ statusCode: 404, statusMessage: 'Product not found' });
        }

        return data;
    } catch (err) {

        if (err?.statusCode === 404) {
            throw createError({ statusCode: 404, statusMessage: 'Product not found' });
        }
        return { error: 'API offline' };

    }
});

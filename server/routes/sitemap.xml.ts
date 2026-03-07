import { HttpService } from "@@/server/services/http-service";
import { getRequestHeaders } from "h3"; // Import getRequestHeaders from h3

export default defineEventHandler(async (event) => {
    const sitemap = await $fetch('https://api.zaad.om/website-api/sitemap.xml')

   
    setHeader(event, 'Content-Type', 'application/xml')

    return sitemap
})
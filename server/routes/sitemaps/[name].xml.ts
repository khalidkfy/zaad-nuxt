export default defineEventHandler(async (event) => {
  // Extract the filename from the URL
  const url = event.node.req.url || ''
  
  // Example: url = "/sitemaps/products.xml"
  const match = url.match(/\/sitemaps\/(.+)\.xml$/)
  if (!match) {
    throw createError({ statusCode: 400, statusMessage: 'Sitemap name missing' })
  }

  const name = match[1] 

  const xml = await $fetch(
    `https://api.zaad.om/website-api/sitemaps/${name}.xml`
  )

  setHeader(event, 'Content-Type', 'application/xml')

  return xml
})
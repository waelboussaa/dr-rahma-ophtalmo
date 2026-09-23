import type { APIRoute } from "astro";

/**
 * Generated rather than static so the sitemap URL always matches the deployed
 * origin, including on preview builds.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("http://localhost:4321");
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("sitemap-index.xml", origin).href}`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

import { locations } from "@/lib/locations";
import { getPublishedBlogPages } from "./storage";
import type { ExistingPage } from "./schemas";

const staticPages: ExistingPage[] = [
  { url: "/", title: "Bed Bug Treatment India", topic: "professional bed bug treatment in India", source: "route" },
  { url: "/services", title: "Bed Bug Treatment Services", topic: "bed bug treatment services and methods", source: "route" },
  { url: "/faq", title: "Bed Bug Treatment FAQs", topic: "questions about bed bug inspection treatment and prevention", source: "route" },
  { url: "/about", title: "About Bed Bugs Treatment India", topic: "company and pest control service information", source: "route" },
  { url: "/contact", title: "Request a Bed Bug Inspection", topic: "contact and inspection request", source: "route" },
];

export async function getExistingPageInventory(): Promise<ExistingPage[]> {
  const locationPages: ExistingPage[] = locations.map((location) => ({
    url: `/${location.slug}`,
    title: location.title,
    topic: `bed bug treatment in ${location.name}, ${location.state}`,
    source: "location",
  }));
  const databasePages = await getPublishedBlogPages();
  const pages = [...staticPages, ...locationPages, ...databasePages];
  return pages.filter(
    (page, index) => pages.findIndex((candidate) => candidate.url === page.url) === index,
  );
}

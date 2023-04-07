import { Scraper } from "./src/scraper";

(async () => {
  const scraper = new Scraper();
  const program = await scraper.getProgramById(414924);
})();

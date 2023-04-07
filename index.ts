import { Scraper } from "./src/scraper";

(async () => {
  const scraper = new Scraper({ baseUrl: "https://sigaa.unb.br/sigaa/public" });

  const program = await scraper.getProgramById(414924);

  console.log(program.get());
})();

import { Program } from "./src/program";
import { Scraper } from "./src/scraper/default";
import { UnbScraper } from "./src/scraper/unb";

(async () => {
  const unb = new UnbScraper();

  const program = new Program(unb, {
    id: 414924,
    title: "Ciência da Computação",
    degree: "Bacharelado",
    shift: "Noturno",
  });

  program.getCurricula();
})();

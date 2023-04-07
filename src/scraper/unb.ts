import { Program } from "../program";
import { Scraper } from "./default";

const baseUrl = "https://sigaa.unb.br/sigaa/public";

export class UnbScraper extends Scraper {
  constructor() {
    super({ baseUrl });
  }
}

import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { Scraper } from "./scraper/default";

type ProgramType = {
  id: number;
  title: string;
  degree: string;
  shift: string;
};

export class Program {
  private scraper: Scraper;

  private id: number;
  private title: string;
  private degree: string;
  private shift: string;

  constructor(scraper: Scraper, program: ProgramType) {
    this.scraper = scraper;
    this.id = program.id;
    this.title = program.title;
    this.degree = program.degree;
    this.shift = program.shift;
  }

  public scrapeCurriculaPage(pageContent: string): Map<number, boolean> {
    const curriculaMap = new Map<number, boolean>();

    const $ = cheerio.load(pageContent);

    $(".linha_impar, .linha_par", "table#table_lt").each((index, element) => {
      const curriculumId = $("a", element)
        .attr("onclick")
        ?.match(/'id':'(\d+)'/)
        ?.at(1);

      if (!curriculumId) {
        return;
      }

      const isCurriculumActive = $(element).text().includes("Ativa");

      curriculaMap.set(parseInt(curriculumId), isCurriculumActive);
    });

    return curriculaMap;
  }

  public getProgramCurriculaUrl(): string {
    return `${this.scraper.getBaseUrl()}/curso/curriculo.jsf?lc=pt_BR&id=${
      this.id
    }`;
  }

  public async getCurriculaPage(): Promise<AxiosResponse<string>["data"]> {
    const programCurriculaUrl = this.getProgramCurriculaUrl();

    const response: AxiosResponse<string> = await axios.get(
      programCurriculaUrl
    );

    return response.data;
  }

  public async getCurricula(): Promise<void> {
    const programPage = await this.getCurriculaPage();
    const curriculaIds = this.scrapeCurriculaPage(programPage);

    console.log(curriculaIds);
  }
}

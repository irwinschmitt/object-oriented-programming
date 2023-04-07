import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { Program } from "./program";

type ScraperConstructor = {
  baseUrl: string;
};

export class Scraper {
  private baseUrl: string;

  constructor(constructor: ScraperConstructor) {
    this.baseUrl = constructor.baseUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public async getProgramById(programId: number): Promise<Program> {
    return await Program.getById(this, programId);
  }

  public async getGraduationProgramsPage(): Promise<
    AxiosResponse<string>["data"]
  > {
    const programsUrl = `${this.baseUrl}/curso/lista.jsf?nivel=G&aba=p-graduacao`;

    const response: AxiosResponse<string> = await axios.get(programsUrl);

    return response.data;
  }

  public async scrapeGraduationProgramsPage(
    pageContent: string
  ): Promise<Program[]> {
    const programs: Program[] = [];

    const $ = cheerio.load(pageContent);

    $(".linhaImpar, .linhaPar", "table.listagem").each((_index, element) => {
      const programId = $("a", element)
        .attr("href")
        ?.match(/id=(\d+)/)
        ?.at(1);

      if (!programId) {
        return;
      }

      const [title, degree, shift, location, mode, coordinator] = $(
        "td",
        element
      )
        .map((_index, element) =>
          $(element)
            .text()
            .replace(/(\t|\n)/gm, "")
        )
        .get();

      programs.push(
        new Program(this, {
          id: parseInt(programId),
          title,
          degree,
          shift,
          location,
          mode,
          coordinator,
        })
      );
    });

    return programs;
  }
}

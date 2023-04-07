import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";

export class Scraper {
  constructor() {}

  public scrapeProgramCurriculaPage(pageContent: string): Map<number, boolean> {
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

  public getProgramCurriculaUrl(programId: number): string {
    return `https://sigaa.unb.br/sigaa/public/curso/curriculo.jsf?lc=pt_BR&id=${programId}`;
  }

  public async getProgramCurriculaPage(
    programId: number
  ): Promise<AxiosResponse<string>["data"]> {
    const programCurriculaUrl = this.getProgramCurriculaUrl(programId);

    const response: AxiosResponse<string> = await axios.get(
      programCurriculaUrl
    );

    return response.data;
  }

  public async getProgramById(programId: number): Promise<void> {
    const programPage = await this.getProgramCurriculaPage(programId);
    const curriculaIds = this.scrapeProgramCurriculaPage(programPage);

    console.log(curriculaIds);
  }
}

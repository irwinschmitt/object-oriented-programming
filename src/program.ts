import axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { Scraper } from "./scraper";

type ProgramType = {
  id: number;
  title: string;
  degree: string;
  shift: string;
  location: string;
  mode: string;
  coordinator: string;
};

export class Program {
  private scraper: Scraper;

  private id: number;
  private title: string;
  private degree: string;
  private shift: string;
  private location: string;
  private mode: string;
  private coordinator: string;

  constructor(scraper: Scraper, program: ProgramType) {
    this.scraper = scraper;
    this.id = program.id;
    this.title = program.title;
    this.degree = program.degree;
    this.shift = program.shift;
    this.location = program.location;
    this.mode = program.mode;
    this.coordinator = program.coordinator;
  }

  public get(): ProgramType {
    return {
      id: this.id,
      title: this.title,
      degree: this.degree,
      shift: this.shift,
      location: this.location,
      mode: this.mode,
      coordinator: this.coordinator,
    };
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

  public static async getById(
    scraper: Scraper,
    programId: number
  ): Promise<Program> {
    const graduationProgramsPage = await scraper.getGraduationProgramsPage();

    const programs = await scraper.scrapeGraduationProgramsPage(
      graduationProgramsPage
    );

    const program = programs.find((program) => program.id === programId);

    if (!program) {
      throw new Error("Program not found");
    }

    return program;
  }
}

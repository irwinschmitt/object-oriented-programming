import { Program } from "../program";

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

  public async getProgramById(programId: number): Promise<void> {
    // return await Program.getById(this, programId);
  }
}

import type { IAuthor } from "./IAuthor";

export enum BookStatus {
  AVAILABLE = "available",
  BORROWED = "borrowed",
}

export enum BookLanguage {
  HINDI = "hindi",
  ENGLISH = "english",
  BENGALI = "bengali",
}

export interface IBook {
  id: string;
  title: string;
  authorId: string[];
  genre: string;
  publishedYear: string;
  status: BookStatus;
  isbn: string;
  pages: number;
  language: number;
  coverImageUrl: string;
  authors?: IAuthor[];
}

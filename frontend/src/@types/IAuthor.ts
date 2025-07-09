import type { IBook } from "./IBook";

export interface IAuthor {
  id: string;
  name: string;
  bio: string;
  nationality: string;
  dob: string;
  awards: string[];
  books?: IBook[];
}

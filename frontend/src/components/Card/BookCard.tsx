import { SquarePen, Trash2 } from "lucide-react";
import type { IAuthor } from "../../@types/IAuthor";
import { BookLanguage, BookStatus } from "../../@types/IBook";

interface IBookCardProps {
  coverImageUrl: string;
  title: string;
  status: string;
  authors: IAuthor[];
  genre: string;
  publishedYear: string;
  pages: number;
  isbn: string;
  language: number;
  editFn: () => void;
  deleteFn: () => void;
}

const BookCard = (book: IBookCardProps) => {
  return (
    <div className="border rounded-lg p-3 px-2 w-[400px]">
      <img
        src={book.coverImageUrl}
        className="w-full h-96 rounded-tl-lg rounded-tr-lg"
      />
      <div className="px-2 mt-2">
        <div className="flex justify-between gap-x-2">
          <p className="text-lg font-semibold">{book.title}</p>
          <p className="bg-black text-white p-1 px-3 text-xs rounded-full capitalize h-fit">
            {Object.entries(BookStatus).at(Number(book.status))?.at(1)}
          </p>
        </div>
        <p className="text-sm font-medium text-gray-500 italic">
          by{" "}
          {book.authors?.map((author, index) => (
            <span>
              {" "}
              {author.name}
              {book.authors?.length && book.authors?.length - 1 === index
                ? ""
                : ","}
            </span>
          ))}
        </p>
        <p className="p-1 px-2 text-xs border rounded-full font-bold capitalize mt-2 inline-block">
          {book.genre}
        </p>{" "}
        <div className="mt-2 flex items-center gap-x-2">
          <p className="text-gray-600">Published on {book.publishedYear}</p> |
          <p className="text-gray-600 font-medium">{book.pages} pages</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 capitalize">
            Language:{" "}
            <span className="text-black capitalize font-medium">
              {Object.values(BookLanguage)[book.language]}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            ISBN:{" "}
            <span className="text-black capitalize font-medium">
              {book.isbn}
            </span>
          </p>
        </div>
        <div className="flex justify-between mt-2 text-sm gap-x-2">
          <button
            onClick={book.editFn}
            className="flex items-center gap-x-2 border flex-1 justify-center  font-semibold rounded-lg cursor-pointer hover:bg-black hover:text-white py-1 transition-all duration-300"
          >
            <SquarePen width={16} /> Edit
          </button>
          <button
            className="flex items-center gap-x-2 flex-1 border justify-center text-red-400 hover:text-white hover:bg-red-400 font-semibold rounded-lg cursor-pointer transition-all duration-300"
            onClick={book.deleteFn}
          >
            <Trash2 width={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

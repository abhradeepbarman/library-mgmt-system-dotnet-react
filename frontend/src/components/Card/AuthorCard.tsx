import { Book, SquarePen, Trash2 } from "lucide-react";
import type { IBook } from "../../@types/IBook";
import { useState } from "react";

interface IAuthorCardProps {
  name: string;
  books: IBook[];
  bio: string;
  nationality: string;
  dob: string;
  awards: string[];
  viewBooksFn: () => void;
  editFn: () => void;
  deleteFn: () => void;
}

const AuthorCard = (author: IAuthorCardProps) => {
  const [readMore, setReadMore] = useState<boolean>(false);

  return (
    <div className="border p-4 rounded-lg w-[400px]">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold w-[75%] break-all!">
          {author.name}
        </p>
        <p className="border text-xs text-gray-600 p-1 px-2 rounded-full w-[20%] font-semibold text-center">
          {author.books?.length || "0"} Books
        </p>
      </div>
      <p className="mt-6 mb-3">
        {author.bio.length > 100 ? (
          <>
            {author.bio.slice(0, 90)}
            {!readMore ? (
              <>
                ...
                <span
                  onClick={() => setReadMore(true)}
                  className="font-semibold text-blue-500 cursor-pointer"
                >
                  Read More
                </span>
              </>
            ) : (
              <>
                {author.bio.slice(91, author.bio.length)}{" "}
                <span
                  onClick={() => setReadMore(false)}
                  className="font-semibold text-blue-500 cursor-pointer"
                >
                  See less
                </span>
              </>
            )}
          </>
        ) : (
          author.bio
        )}
      </p>
      <p>
        <span className="font-semibold">Nationality:</span> {author.nationality}
      </p>
      <p>
        <span className="font-semibold">Born on:</span> {author.dob}
      </p>
      <div className="my-3">
        <span className="font-semibold">Awards:</span>
        <div className="flex overflow-x-auto gap-x-2 gap-y-2 mt-1 flex-wrap">
          {author.awards.length > 0 ?  author.awards.map((award: string) => (
            <p className="p-1 px-2 text-xs rounded-full bg-gray-400 text-white min-w-fit">
              {award}
            </p>
          )): <p>N/A</p>}
        </div>
      </div>
      <div className="flex w-full gap-x-2">
        <button
          onClick={author.viewBooksFn}
          className="w-2/3 border cursor-pointer flex items-center justify-center py-2 rounded-lg font-semibold gap-x-2 hover:bg-black hover:text-white transition-all duration-300"
        >
          <Book width={18} />
          View Books
        </button>
        <button
          className="flex items-center gap-x-2 border flex-1 justify-center  font-semibold rounded-lg cursor-pointer hover:bg-black hover:text-white p-2 transition-all duration-300"
          onClick={author.editFn}
        >
          <SquarePen width={16} /> Edit
        </button>
        <button
          onClick={author.deleteFn}
          className="flex items-center gap-x-2 flex-1 border justify-center text-red-400 hover:text-white hover:bg-red-400 font-semibold rounded-lg cursor-pointer p-2 transition-all duration-300"
        >
          <Trash2 width={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AuthorCard;

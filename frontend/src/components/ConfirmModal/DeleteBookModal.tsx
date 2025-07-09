import { AxiosError } from "axios";
import { type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import type { IBook } from "../../@types/IBook";
import axiosInstance from "../../lib/axios";

const DeleteBookModal = ({
  bookId,
  closeFn,
  setBooks,
}: {
  bookId: string;
  closeFn: () => void;
  setBooks: Dispatch<SetStateAction<IBook[]>>;
}) => {
  const deleteAuthor = async () => {
    try {
      await axiosInstance.post(`/Book/${bookId}/delete`);
      toast.success("Author deleted successfully");
      setBooks((prev) => [...prev.filter((p) => p.id != bookId)]);
      closeFn();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    }
  };

  return (
    <div className="px-3">
      <p className="text-2xl font-semibold">Delete Author</p>
      <p>Are you sure you want to delete this book?</p>
      <div className="flex justify-between mt-5 gap-5">
        <button
          onClick={closeFn}
          className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-semibold cursor-pointer border-2 border-black outline-none bg-transparent hover:bg-black text-black hover:text-white transition-all duration-300 flex-1"
        >
          Cancel
        </button>
        <button
          onClick={deleteAuthor}
          className="px-5 py-2.5 rounded-lg cursor-pointer text-white text-sm tracking-wider font-medium border border-current outline-none bg-orange-700 hover:bg-orange-800 active:bg-orange-700 flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteBookModal;

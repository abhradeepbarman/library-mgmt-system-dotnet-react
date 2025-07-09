import { AxiosError } from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";
import type { Dispatch, SetStateAction } from "react";
import type { IAuthor } from "../../@types/IAuthor";

const DeleteAuthorModal = ({
  authorId,
  closeFn,
  setAuthors,
}: {
  authorId: string;
  closeFn: () => void;
  setAuthors: Dispatch<SetStateAction<IAuthor[]>>;
}) => {
  const deleteAuthor = async () => {
    try {
      await axiosInstance.post(`/Author/${authorId}/delete`);
      toast.success("Author deleted successfully");
      setAuthors((prev) => [...prev.filter((p) => p.id != authorId)]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    } finally {
      closeFn();
    }
  };

  return (
    <div className="px-3">
      <p className="text-2xl font-semibold">Delete Author</p>
      <p>Are you sure you want to delete this author?</p>
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

export default DeleteAuthorModal;

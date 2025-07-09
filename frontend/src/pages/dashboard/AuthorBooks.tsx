import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import type { IAuthor } from "../../@types/IAuthor";
import { type IBook } from "../../@types/IBook";
import BookCard from "../../components/Card/BookCard";
import BackButton from "../../components/common/BackButton";
import Modal from "../../components/common/Modal";
import Navbar from "../../components/common/Navbar";
import NotFound from "../../components/common/NotFound";
import DeleteBookModal from "../../components/ConfirmModal/DeleteBookModal";
import UpdateBookForm from "../../components/Form/Books/UpdateBookForm";
import axiosInstance from "../../lib/axios";
import Loader from "../../components/common/Loader";

const AuthorBooks = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [author, setAuthor] = useState<IAuthor | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [showEditModal, setShowEditModal] = useState<IBook | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { authorId } = useParams();

  const fetchAuthorBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(`/Book/author/${authorId}`);
      setBooks(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthor = async () => {
    try {
      const response = await axiosInstance(`/Author/${authorId}`);
      setAuthor(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAuthor();
    fetchAuthorBooks();
  }, []);

  return (
    <div>
      <Navbar title={`${author?.name || "Author"}'s Books`} />
      <div className="mx-10 mt-5 ">
        <BackButton />
      </div>
      <div className="flex flex-wrap gap-4 px-10 mt-5">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center mt-32">
            <Loader />
          </div>
        ) : books.length > 0 ? (
          <>
            {books.map((book) => (
              <BookCard
                coverImageUrl={book.coverImageUrl}
                title={book.title}
                status={book.status}
                authors={book.authors || []}
                genre={book.genre}
                publishedYear={book.publishedYear}
                pages={book.pages}
                isbn={book.isbn}
                language={book.language}
                editFn={() => setShowEditModal(book)}
                deleteFn={() => setShowDeleteModal(book.id)}
              />
            ))}
          </>
        ) : (
          <NotFound
            title="Books not found"
            description="You haven't added any Book or there is a Network failure"
          />
        )}
      </div>

      {showDeleteModal && (
        <Modal closeFn={() => setShowDeleteModal("")}>
          <DeleteBookModal
            bookId={showDeleteModal}
            closeFn={() => setShowDeleteModal("")}
            setBooks={setBooks}
          />
        </Modal>
      )}

      {showEditModal && (
        <Modal closeFn={() => setShowEditModal(undefined)}>
          <UpdateBookForm
            closeFn={() => setShowEditModal(undefined)}
            bookData={showEditModal}
            setBooks={setBooks}
          />
        </Modal>
      )}
    </div>
  );
};

export default AuthorBooks;

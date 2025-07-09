import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { type IBook } from "../../@types/IBook";
import BookCard from "../../components/Card/BookCard";
import AddButton from "../../components/common/AddButton";
import FilterOptions from "../../components/common/FilterOptions";
import Modal from "../../components/common/Modal";
import Navbar from "../../components/common/Navbar";
import NotFound from "../../components/common/NotFound";
import SearchBar from "../../components/common/SearchBar";
import DeleteBookModal from "../../components/ConfirmModal/DeleteBookModal";
import AddBookForm from "../../components/Form/Books/AddBookForm";
import UpdateBookForm from "../../components/Form/Books/UpdateBookForm";
import { BookGenres } from "../../constants";
import axiosInstance from "../../lib/axios";
import Loader from "../../components/common/Loader";
import StatsCard from "../../components/Card/StatsCard";
import { Book, BookCheck, BookOpenText, UserPen } from "lucide-react";

export type IFilters = {
  genre: string;
  language: string;
  status: string;
};

const BookPage = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [showEditModal, setShowEditModal] = useState<IBook | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState<string>("");
  const [filters, setFilters] = useState<IFilters>({
    genre: "",
    language: "",
    status: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalAuthors: 0,
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchText) {
        params.append("title", searchText);
      }

      if (filters.genre) {
        params.append("genre", filters.genre);
      }
      if (filters.language) {
        params.append("language", filters.language);
      }
      if (filters.status) {
        params.append("status", filters.status);
      }

      const response = await axiosInstance(`/Book?${params}`);
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

  const fetchStats = async () => {
    try {
      const response = await axiosInstance(`/Book/stats`);
      setStats(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    // Debouncing
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, filters.genre, filters.language, filters.status]);

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar title="Books List" />
      <div className="mt-5 mx-10 flex gap-x-4">
        <StatsCard
          name="Borrowed Books"
          number={stats.borrowedBooks}
          icon={<Book />}
          classname="bg-[#FEEBF6]"
        />
        <StatsCard
          name="Available Books"
          number={stats.availableBooks}
          icon={<BookCheck />}
          classname="bg-[#FFFDF6]"
        />
        <StatsCard
          name="Total Books"
          number={stats.totalBooks}
          icon={<BookOpenText />}
          classname="bg-[#E8F9FF]"
        />
        <StatsCard
          name="Authors"
          number={stats.totalAuthors}
          icon={<UserPen />}
          classname="bg-[#ECFAE5]"
        />
      </div>
      <div className="mx-10 my-5 flex justify-start gap-x-3">
        <SearchBar
          placeholder="Search by title"
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <FilterOptions
          defaultOption="Filter by genre"
          options={BookGenres}
          onchange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFilters((prev) => ({ ...prev, genre: e.target.value }));
          }}
          value={filters.genre}
        />
        <FilterOptions
          defaultOption="Filter by Language"
          options={["english", "bengali", "hindi"]}
          onchange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFilters((prev) => ({ ...prev, language: e.target.value }));
          }}
          value={filters.language}
        />
        <FilterOptions
          defaultOption="Filter by Availability"
          options={["available", "borrowed"]}
          onchange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFilters((prev) => ({ ...prev, status: e.target.value }));
          }}
          value={filters.status}
        />
        <div
          className="h-10 justify-center items-center flex px-2 cursor-pointer border-4 active:bg-neutral-800 active:text-white transition-all duration-300"
          onClick={() =>
            setFilters({
              genre: "",
              language: "",
              status: "",
            })
          }
        >
          <span className="select-none">Clear Filters</span>
        </div>
        <AddButton title="Book" onclick={() => setShowAddForm(true)} />
      </div>
      <div className="flex flex-wrap gap-4 px-10 mb-10">
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

      {showAddForm && (
        <Modal closeFn={() => setShowAddForm(false)}>
          <AddBookForm
            setBooks={setBooks}
            closeFn={() => setShowAddForm(false)}
          />
        </Modal>
      )}

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

export default BookPage;

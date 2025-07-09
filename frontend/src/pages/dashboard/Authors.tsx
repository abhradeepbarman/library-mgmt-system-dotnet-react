import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { IAuthor } from "../../@types/IAuthor";
import AuthorCard from "../../components/Card/AuthorCard";
import AddButton from "../../components/common/AddButton";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Navbar from "../../components/common/Navbar";
import NotFound from "../../components/common/NotFound";
import SearchBar from "../../components/common/SearchBar";
import DeleteAuthorModal from "../../components/ConfirmModal/DeleteAuthorModal";
import AddAuthorForm from "../../components/Form/Authors/AddAuthorForm";
import UpdateAuthorForm from "../../components/Form/Authors/UpdateAuthorForm";
import axiosInstance from "../../lib/axios";

const AuthorPage = () => {
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [showForm, setShowForm] = useState<Boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState<IAuthor | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAuthors = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchText) {
      params.append("name", searchText);
    }

    try {
      const response = await axiosInstance(`/Author?${params}`);
      setAuthors(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debouncing
    const timer = setTimeout(() => {
      fetchAuthors();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <div className="min-h-full">
      <Navbar title="Authors List" />
      <div className="flex items-center">
        <SearchBar
          placeholder="Search by Author Name"
          className="my-5 mr-3 ml-10"
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <AddButton title="Author" onclick={() => setShowForm(true)} />
      </div>
      <div className="mx-10 flex flex-wrap gap-4 min-h-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center mt-32">
            <Loader />
          </div>
        ) : authors.length > 0 ? (
          <>
            {authors.map((author) => (
              <AuthorCard
                name={author.name}
                books={author.books || []}
                bio={author.bio}
                nationality={author.nationality}
                dob={author.dob}
                awards={author.awards}
                viewBooksFn={() => navigate(`/dashboard/authors/${author.id}`)}
                editFn={() => setShowUpdateModal(author)}
                deleteFn={() => setShowDeleteModal(author.id)}
              />
            ))}
          </>
        ) : (
          <NotFound
            title="Authors not found"
            description="You haven't added any Author or there is a Network failure"
          />
        )}
      </div>

      {showForm && (
        <Modal closeFn={() => setShowForm(false)}>
          <AddAuthorForm
            setAuthors={setAuthors}
            closeFn={() => setShowForm(false)}
          />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal closeFn={() => setShowDeleteModal("")}>
          <DeleteAuthorModal
            authorId={showDeleteModal}
            setAuthors={setAuthors}
            closeFn={() => setShowDeleteModal("")}
          />
        </Modal>
      )}

      {showUpdateModal && (
        <Modal closeFn={() => setShowUpdateModal(undefined)}>
          <UpdateAuthorForm
            authorData={showUpdateModal}
            setAuthors={setAuthors}
            closeFn={() => setShowUpdateModal(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AuthorPage;

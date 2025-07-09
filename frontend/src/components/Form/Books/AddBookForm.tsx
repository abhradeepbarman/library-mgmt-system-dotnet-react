import axios, { AxiosError } from "axios";
import { Upload, X } from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { IAuthor } from "../../../@types/IAuthor";
import { BookLanguage, BookStatus, type IBook } from "../../../@types/IBook";
import axiosInstance from "../../../lib/axios";
import config from "../../../config";
import Loader from "../../common/Loader";
import { BookGenres } from "../../../constants";

const AddBookForm = ({
  setBooks,
  closeFn,
}: {
  setBooks: Dispatch<SetStateAction<IBook[]>>;
  closeFn: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<IAuthor[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      Title: "",
      Genre: "",
      PublishedYear: "",
      Status: BookStatus.AVAILABLE,
      ISBN: "",
      Pages: 0,
      Language: BookLanguage.ENGLISH,
    },
  });

  const fetchAuthors = async () => {
    try {
      if (!authors.length) {
        const response = await axiosInstance.get("/Author");
        if (response.data) {
          setAuthors((prev) => [...prev, ...response.data]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const onsubmit = async (data: any) => {
    if (!coverImageUrl) {
      setImageError("Cover image is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Loading...");
    data.AuthorIds = selectedAuthors.map((author) => author.id);
    data.Status = Object.values(BookStatus).indexOf(data.Status);
    data.Language = Object.values(BookLanguage).indexOf(data.Language);
    data.CoverImageUrl = coverImageUrl;

    try {
      const response = await axiosInstance.post("/Book", data);
      if (response.data) {
        response.data.authors = selectedAuthors;
        setBooks((prev) => [...prev, response.data]);
      }
      toast.success("Book Details added successfully");
      setSelectedAuthors([]);
      setCoverImageUrl("");
      closeFn();
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
      setImageError("");
    }
  };

  const removeAuthor = (id: string) => {
    setSelectedAuthors((prev) => [...prev.filter((p) => p.id != id)]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      // cloudinary upload
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", config.CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", config.CLOUDINARY_CLOUD_NAME);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );
      setCoverImageUrl(res.data.secure_url);
    } catch (error) {
      toast.error("Error uploading cover image");
      setCoverImageUrl("");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-[400px]">
        <h2 className="text-center text-2xl font-semibold">Add Book Details</h2>
        <form className="mt-5 flex flex-col gap-y-2">
          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Book Title<span className="text-red-400">*</span>
            </label>
            <input
              placeholder="Harry Potter"
              className="border px-1 py-1 rounded-md"
              {...register("Title", {
                required: {
                  value: true,
                  message: "Title is required",
                },
                minLength: {
                  value: 3,
                  message: "Title should be atleast 3 characters long",
                },
              })}
            />
            {errors.Title && (
              <div className="text-sm text-red-500">{errors.Title.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Genre<span className="text-red-400">*</span>
            </label>
            <select
              {...register("Genre", {
                required: {
                  value: true,
                  message: "Genre is required",
                },
              })}
              className="border-[0.01px] rounded-md py-1"
            >
              <option disabled selected>
                Select Book Genre
              </option>
              {BookGenres.map((genre) => (
                <option className="capitalize" value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Published Year<span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="1900"
              max={2025}
              step="1"
              {...register("PublishedYear", {
                required: {
                  value: true,
                  message: "Published Year is required",
                },
              })}
              className="border-[0.01px] rounded-md py-1 px-3"
            />

            {errors.PublishedYear && (
              <div className="text-sm text-red-500">
                {errors.PublishedYear.message}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Book Status<span className="text-red-400">*</span>
            </label>
            <select
              {...register("Status", {
                required: {
                  value: true,
                  message: "Status is required",
                },
              })}
              className="border-[0.01px] rounded-md py-1 px-3 capitalize"
            >
              {Object.values(BookStatus).map((status) => (
                <option value={status.toString()}>{status}</option>
              ))}
            </select>
            {errors.Status && (
              <div className="text-sm text-red-500">
                {errors.Status.message}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter ISBN<span className="text-red-400">*</span>
            </label>
            <input
              placeholder="978-3-16-148410-0"
              className="border px-1 py-1 rounded-md"
              {...register("ISBN", {
                required: {
                  value: true,
                  message: "ISBN is required",
                },
                minLength: {
                  value: 3,
                  message: "ISBN should be atleast 3 characters long",
                },
              })}
            />
            {errors.ISBN && (
              <div className="text-sm text-red-500">{errors.ISBN.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Pages<span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="0"
              {...register("Pages", {
                required: {
                  value: true,
                  message: "Pages is required",
                },
              })}
              className="border-[0.01px] rounded-md py-1 px-3"
            />

            {errors.Pages && (
              <div className="text-sm text-red-500">{errors.Pages.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Language of the Book<span className="text-red-400">*</span>
            </label>
            <select
              {...register("Language", {
                required: {
                  value: true,
                  message: "Language is required",
                },
              })}
              className="border-[0.01px] rounded-md py-1 px-3 capitalize"
            >
              {Object.values(BookLanguage).map((lang) => (
                <option value={lang.toString()}>{lang}</option>
              ))}
            </select>
            {errors.Language && (
              <div className="text-sm text-red-500">
                {errors.Language.message}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Authors of this book<span className="text-red-400">*</span>
            </label>
            <select
              className="border-[0.01px] rounded-md py-1 px-3 capitalize"
              onChange={(e) => {
                const selectedAuthor = authors.find(
                  (author) => author.id === e.target.value
                );
                if (selectedAuthor) {
                  setSelectedAuthors((prev) => {
                    const newArr = [...prev, selectedAuthor];
                    const uniqueSet = new Set(newArr);
                    return [...uniqueSet];
                  });
                }
              }}
            >
              <option>Select authors</option>
              {authors.map((author) => (
                <option value={author.id}>{author.name}</option>
              ))}
            </select>
            <div className="flex flex-wrap mt-4 gap-2">
              {selectedAuthors.map((author) => (
                <div className="bg-black text-white p-1 px-3 rounded-2xl flex items-center gap-x-1">
                  {author.name}
                  <span className="text-white cursor-pointer">
                    <X
                      width={15}
                      height={15}
                      onClick={() => removeAuthor(author.id)}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold">
              Upload cover image<span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-gray-500">
              If you want to upload new cover image, just reupload
            </p>
            {imageError && (
              <div className="text-sm text-red-500">{imageError}</div>
            )}
            <div className="flex gap-x-2  mt-3">
              <div
                className="p-5 border-dotted border-2 rounded-xl w-[100px] h-[100px] flex justify-center items-center cursor-pointer"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.click();
                  }
                }}
              >
                <Upload />
              </div>
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept=".jpg, .jpeg"
                onChange={handleFileChange}
              />
              <div className="flex justify-center items-center w-[100px] h-[100px]">
                {loading ? (
                  <Loader />
                ) : (
                  coverImageUrl && (
                    <img src={coverImageUrl} className="w-[100px] h-[100px]" />
                  )
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit(onsubmit)}
            disabled={loading}
            className="flex justify-center items-center gap-x-2 px-3 py-1 bg-black text-white font-semibold rounded-lg cursor-pointer mt-3"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;

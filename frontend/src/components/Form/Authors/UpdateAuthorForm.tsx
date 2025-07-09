import { useForm } from "react-hook-form";
import type { IAuthor } from "../../../@types/IAuthor";
import axios, { AxiosError } from "axios";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../../lib/axios";

const UpdateAuthorForm = ({
  authorData,
  setAuthors,
  closeFn,
}: {
  authorData: IAuthor;
  setAuthors: Dispatch<SetStateAction<IAuthor[]>>;
  closeFn: () => void;
}) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [awards, setAwards] = useState<string[]>(authorData.awards);
  const [awardInput, setAwardInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      Name: authorData.name,
      Bio: authorData.bio,
      Nationality: authorData.nationality,
      DOB: authorData.dob,
    },
  });

  const handleAwardsInput = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (awardInput.trim() !== "") {
        setAwards((prev) => [...prev, awardInput]);
        setAwardInput("");
      }
    }
  };

  const fetchCountries = async () => {
    try {
      var response = await axios.get("https://api.first.org/data/v1/countries");
      var formattedCountried = Object.entries(response.data.data)?.map(
        (country: any) => country[1].country
      );
      setCountries(formattedCountried);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const removeAward = (award: string) => {
    setAwards((prev) => [...prev.filter((p) => p != award)]);
  };

  const onsubmit = async (data: any) => {
    data.Awards = [...awards];
    setLoading(true);
    const toastId = toast.loading("Loading...");
    try {
      const response = await axiosInstance.post(
        `/Author/${authorData.id}/update`,
        data
      );
      if (response.data) {
        setAuthors((prev) =>
          prev.map((p) => {
            if (p.id == authorData.id) {
              return response.data;
            }
            return p;
          })
        );
      }
      toast.success("Author Details added successfully");
      setAwardInput("");
      closeFn();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-[400px]">
        <h2 className="text-center text-2xl font-semibold">
          Edit Author Details
        </h2>
        <form className="mt-5 flex flex-col gap-y-2">
          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Author Name<span className="text-red-400">*</span>
            </label>
            <input
              placeholder="Camden"
              className="border px-1 py-1 rounded-md"
              {...register("Name", {
                required: {
                  value: true,
                  message: "Name is required",
                },
                minLength: {
                  value: 3,
                  message: "Name should be atleast 3 characters long",
                },
              })}
            />
            {errors.Name && (
              <div className="text-sm text-red-500">{errors.Name.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Bio<span className="text-red-400">*</span>
            </label>
            <textarea
              className="border-[1px] px-1 py-1 rounded-md"
              placeholder="5x Oscar winner"
              {...register("Bio", {
                required: {
                  value: true,
                  message: "Bio is required",
                },
              })}
            />
            {errors.Bio && (
              <div className="text-sm text-red-500">{errors.Bio.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Country<span className="text-red-400">*</span>
            </label>
            <select
              className="border px-1 py-1 rounded-md"
              {...register("Nationality", {
                required: {
                  value: true,
                  message: "Nationality is required",
                },
              })}
            >
              <option>Select Author's Country</option>
              {countries.map((country: string) => (
                <option
                  value={country}
                  selected={country === authorData.nationality}
                >
                  {country}
                </option>
              ))}
            </select>

            {errors.Nationality && (
              <div className="text-sm text-red-500">
                {errors.Nationality.message}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Date of Birth<span className="text-red-400">*</span>
            </label>
            <input
              className="border px-1 py-1 rounded-md"
              type="date"
              {...register("DOB", {
                required: {
                  value: true,
                  message: "DOB is required",
                },
              })}
              max={new Date().toISOString().substring(0, 10)}
            />
            {errors.DOB && (
              <div className="text-sm text-red-500">{errors.DOB.message}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Enter Awards won by the Author
            </label>
            <input
              type="text"
              className="border px-1 py-1 rounded-md"
              onKeyDown={(e) => handleAwardsInput(e)}
              value={awardInput}
              onChange={(e) => setAwardInput(e.target.value)}
              placeholder="place enter for awards"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {awards.map((award) => (
                <div className="bg-black text-white p-1 px-3 rounded-2xl flex items-center gap-x-1">
                  {award}
                  <span className="text-white cursor-pointer">
                    <X
                      width={15}
                      height={15}
                      onClick={() => removeAward(award)}
                    />
                  </span>
                </div>
              ))}
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

export default UpdateAuthorForm;

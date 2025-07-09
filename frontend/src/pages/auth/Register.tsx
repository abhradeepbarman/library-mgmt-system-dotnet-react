import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { AxiosError } from "axios";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard/books");
    }
  }, [accessToken]);

  const onsubmit = async (data: RegisterFormData) => {
    const toastId = toast.loading("Loading...");
    try {
      const result = await axiosInstance.post("/Auth/register", data);
      localStorage.setItem("accessToken", result.data?.accessToken);
      localStorage.setItem("refreshToken", result.data?.refreshToken);
      toast.success("Registered in successfully");
      navigate("/dashboard/books");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || error.message);
      }
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-[350px] border-2 py-3 px-4 rounded-lg"
      >
        <Link
          to={"/books"}
          className="flex items-center justify-center space-x-1 mb-5"
        >
          <img src="/logo.png" alt="App Name Logo" className="w-10 h-10" />
          <span
            className={
              "text-xl font-bold text-gray-800 transition-opacity duration-200"
            }
          >
            Capsitech
          </span>
        </Link>
        <p className="text-center text-xl font-semibold underline">Register</p>
        <div className="flex flex-col gap-1 mt-2">
          <label className="font-semibold" htmlFor="name">
            Name
          </label>
          <input
            placeholder="Enter your name"
            className="border p-2 rounded-md"
            {...register("name", {
              required: {
                value: true,
                message: "Name is required",
              },
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <label className="font-semibold" htmlFor="email">
            Email
          </label>
          <input
            placeholder="Enter email"
            className="border p-2 rounded-md"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <label className="font-semibold" htmlFor="password">
            Password
          </label>
          <input
            placeholder="Enter password"
            type="password"
            className="border p-2 rounded-md"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <label className="font-semibold" htmlFor="password">
            Confirm Password
          </label>
          <input
            placeholder="Enter confirm password"
            type="password"
            className="border p-2 rounded-md"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirm Password is required",
              },
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="text-sm mt-2">
          Already have an account?{" "}
          <span className="font-semibold">
            <Link to={"/login"}>Login</Link>
          </span>
        </div>
        <button
          type="submit"
          className="w-full text-center bg-black text-white mt-5 rounded-md py-2 font-semibold cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;

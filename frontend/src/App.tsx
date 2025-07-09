import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthorPage from "./pages/dashboard/Authors";
import AuthorBooks from "./pages/dashboard/AuthorBooks";
import BookPage from "./pages/dashboard/Books";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard">
          <Route
            path="books"
            index
            element={
              <AuthLayout>
                <BookPage />
              </AuthLayout>
            }
          />
          <Route
            path="authors"
            element={
              <AuthLayout>
                <AuthorPage />
              </AuthLayout>
            }
          />
          <Route
            path="authors/:authorId"
            element={
              <AuthLayout>
                <AuthorBooks />
              </AuthLayout>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={"/dashboard/books"} />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

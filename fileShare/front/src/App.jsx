import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import { Route, Routes } from "react-router-dom";
import AppBar from "./AppBar";
import { NextUIProvider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <main className="container mx-auto h-full">
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route element={<AppBar />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
    </NextUIProvider>
  );
}

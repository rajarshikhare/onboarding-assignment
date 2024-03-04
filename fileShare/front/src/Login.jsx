import { Button, Input, Image, Link } from "@nextui-org/react";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { login } from "./ApiService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onSubmit = () => {
    setLoading(true);
    login({
      email,
      password,
    })
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        setErrors(err.response.data.errors);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="flex h-full w-full items-center gap-8 p-16">
      <div className="w-8/12flex items-center justify-center">
        <Image width={800} alt="NextUI hero Image" src="/public/banner.png" />
      </div>
      <div className="flex-grow" />
      <div className="flex w-4/12 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">Login</p>
          <p className="text-sm">Login with username or email-id</p>
        </div>
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          fullWidth
          labelPlacement="outside"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={!!errors["email"]}
          errorMessage={errors["email"]}
          startContent={
            <HiMail className="text-default-400 pointer-events-none flex-shrink-0 text-2xl" />
          }
        />
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          fullWidth
          labelPlacement="outside"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={!!errors["password"]}
          errorMessage={errors["password"]}
          startContent={
            <RiLockPasswordFill className="text-default-400 pointer-events-none flex-shrink-0 text-2xl" />
          }
        />
        <Button color="primary" isLoading={loading} onClick={onSubmit}>
          Login
        </Button>
        <div className="flex items-center gap-4">
          <div>Don&apos;t have an account?</div>
          <div>
            <Link href="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

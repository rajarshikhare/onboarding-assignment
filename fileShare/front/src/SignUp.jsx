import React, { useState } from "react";
import { Button, Input, Image, Link } from "@nextui-org/react";
import { signUp } from "./ApiService";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onSubmit = () => {
    setLoading(true);
    signUp({
      password_confirmation: passwordConfirmation,
      name,
      username,
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
          <p className="text-2xl font-bold">Sign Up</p>
          <p className="text-sm">
            Create account with any email id to create an account
          </p>
        </div>
        <Input
          type="text"
          label="Username"
          placeholder="Enter your username"
          fullWidth
          labelPlacement="outside"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          isInvalid={!!errors["username"]}
          errorMessage={errors["username"]}
        />
        <Input
          type="text"
          label="Name"
          placeholder="Enter your name"
          fullWidth
          labelPlacement="outside"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isInvalid={!!errors["name"]}
          errorMessage={errors["name"]}
        />
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
        />
        <Input
          type="password"
          label="Password Confirmation"
          placeholder="Confirm password"
          fullWidth
          labelPlacement="outside"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          isInvalid={!!errors["password"]}
          errorMessage={errors["password"]}
        />
        <Button color="primary" onClick={onSubmit} isLoading={loading}>
          Sign Up
        </Button>
        <div className="flex items-center gap-4">
          <div>Have an account?</div>
          <div>
            <Link href="/">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

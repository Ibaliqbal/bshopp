import Button from "@/components/ui/button";
import InputField from "@/components/Fragments/InputField";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import authServices from "@/services/auth";
import AuthLayout from "@/components/layouts/AuthLayout";

const RegisterView = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { push } = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;

    const data = {
      fullname: form.fullname.value,
      email: form.email.value,
      password: form.password.value,
    };
    const result = await authServices.registerAccount(data);

    if (result.status === 200) {
      setLoading(false);
      push("/auth/login");
    } else {
      setLoading(false);
      setError(result.status === 400 ? "Email already exist" : "");
    }
  };
  return (
    <AuthLayout
      error={error}
      type="register"
      linkText="Hava an account ? Sign in "
    >
      <form className="w-full" onSubmit={handleRegister}>
        <InputField
          className="w-full mt-4"
          label="Fullname"
          name="fullname"
          type="text"
          placeholder="Fullname"
        />
        <InputField
          className="w-full mt-4"
          label="Email"
          name="email"
          type="email"
          placeholder="johnd@gmail.com"
        />
        <InputField
          className="w-full mt-4"
          label="Password"
          name="password"
          type="password"
          placeholder="********"
        />
        <Button
          type="submit"
          sizes="lg"
          className={`w-full mt-4 text-white ${loading && "opacity-40"}`}
        >
          {loading ? "Loading..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;

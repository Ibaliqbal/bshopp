import Button from "@/components/ui/button";
import { useRouter } from "next/router";
import React, { useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";
import authServices from "@/services/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";

const schema = z.object({
  fullname: z.string().min(3, "Masukkan nama setidaknya 3 huruf"),
  email: z.string().email("Email invalid"),
  password: z
    .string()
    .min(8, "Masukkan password setidaknya 8 huruf")
    .max(16, "Maksimal password 16 huruf"),
});

type TSchema = z.infer<typeof schema>;

const RegisterView = () => {
  const [error, setError] = useState<string>("");
  const { push } = useRouter();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: TSchema) {
    const result = await authServices.registerAccount(data);

    if (result.status === 201) {
      push("/auth/login");
    } else {
      setError(result.status === 200 ? "Email already exist" : "");
    }
  }
  return (
    <AuthLayout
      error={error}
      type="register"
      linkText="Hava an account ? Sign in "
    >
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mt-4 flex flex-col gap-1">
          <Label className="text-xl font-semibold" htmlFor="fullname">
            Fullname
          </Label>
          <Input
            type="text"
            placeholder="Fullname"
            id="fullname"
            className="w-full px-4 py-3"
            {...register("fullname")}
          />
          {errors && <p className="text-red-600">{errors.fullname?.message}</p>}
        </div>
        <div className="w-full mt-4 flex flex-col gap-1">
          <Label className="text-xl font-semibold" htmlFor="email">
            Email
          </Label>
          <Input
            type="email"
            placeholder="johndoe@example.com"
            id="email"
            className="w-full px-4 py-3"
            {...register("email")}
          />
          {errors && <p className="text-red-600">{errors.email?.message}</p>}
        </div>
        <div className="w-full mt-4 flex flex-col gap-1">
          <Label className="text-xl font-semibold" htmlFor="password">
            Password
          </Label>
          <Input
            type="password"
            placeholder="password"
            id="password"
            className="w-full px-4 py-3"
            {...register("password")}
          />
          {errors && <p className="text-red-600">{errors.password?.message}</p>}
        </div>
        <Button
          type="submit"
          sizes="lg"
          disabled={isSubmitting}
          className={`w-full mt-4 text-white disabled:bg-opacity-40`}
        >
          {isSubmitting ? "Loading..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;

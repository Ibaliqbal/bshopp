import Button from "@/components/ui/button";
import InputField from "@/components/Fragments/InputField";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import AuthLayout from "@/components/layouts/AuthLayout";

const LoginView = () => {
  const { push, query } = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const callbackUrl: any = query.callbackUrl || "/";

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    setError("");
    setIsLoading(true);
    try {
      if (callbackUrl) {
        const res = await signIn("credentials", {
          redirect: false,
          email: form.email.value,
          password: form.password.value,
          callbackUrl,
        });
        if (!res?.error) {
          setIsLoading(false);
          push(callbackUrl);
        } else {
          setError("Email or password is incorrect");
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      setError("Email or password is incorrect");
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout
      error={error}
      type="login"
      linkText="Don`t hava an account ? Sign up "
    >
      <form className="w-full" onSubmit={handleLogin}>
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
          disabled={isLoading}
          type="submit"
          sizes="lg"
          className={`w-full mt-4 text-white ${isLoading && "opacity-40"}`}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
      <hr className="my-2 w-full h-[2px] bg-black" />
      <div className="w-full">
        <Button
          type="button"
          sizes="lg"
          onClick={() =>
            signIn("google", {
              callbackUrl,
              redirect: false,
            })
          }
          className="w-full flex items-center justify-center gap-4 text-white"
        >
          <i className="bx bxl-google text-2xl" />
          Login with Google
        </Button>
      </div>
    </AuthLayout>
  );
};

export default LoginView;

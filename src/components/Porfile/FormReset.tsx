import React from "react";
import Label from "../ui/label";
import Input from "../ui/input";
import Button from "../ui/button";
import { User } from "@/types/user";
import userService from "@/services/users";
import { toast } from "sonner";

const FormReset = ({ user }: { user: User }) => {
  const [message, setMessage] = React.useState("");
  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (!user.id) return;
    const form = e.target as HTMLFormElement;
    const oldPw = form.old.value;
    const newPw = form.new.value;
    if (!oldPw || oldPw.trim() === "" || !newPw || newPw.trim() === "") {
      setMessage("Input required");
      return;
    }
    const res = await userService.reset(user.id, {
      old: oldPw,
      new: newPw,
      pw: user.password,
    });
    if (res.data.statusCode === 200) {
      toast.success(res.data.message);
      form.reset();
    } else {
      setMessage(res.data.message);
    }
  };
  return (
    <form
      onSubmit={resetPassword}
      className="w-full mt-4 flex flex-col gap-5 p-4 rounded-md border-2 border-slate-700"
    >
      <h3 className="text-xl font-semibold">Reset password</h3>
      {message ? (
        <p className="w-full inline-flex p-3 bg-red-600 text-white items-center gap-4">
          <i className="bx bx-info-circle text-xl" />
          {message}
        </p>
      ) : null}
      <div className="flex flex-col gap-3">
        <Label htmlFor="old">Old Password</Label>
        <Input
          placeholder="Input your email"
          type="password"
          id="old"
          name="old"
          className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="new">New Password</Label>
        <Input
          placeholder="Input your email"
          type="password"
          id="new"
          name="new"
          className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
        />
      </div>
      <Button className="self-end text-white" sizes="sm">
        Change
      </Button>
    </form>
  );
};

export default FormReset;

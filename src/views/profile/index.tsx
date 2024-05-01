import ProfileLayout from "@/components/layouts/ProfileLayout";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useUser } from "@/context/user/user.context";
import { uploadFile } from "@/lib/firebase/services";
import userService from "@/services/users";
import { schema, TOption, TSchema, User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import Select, { Options } from "react-select";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export default function ProfileView() {
  const user: User = useUser();
  const [uploadImage, setUploadImage] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [provinces, setProvinces] = useState<Options<TOption>>(
    [] as Options<TOption>
  );
  const [cities, setCities] = useState<Options<TOption>>(
    [] as Options<TOption>
  );
  const [districts, setDistricts] = useState<Options<TOption>>(
    [] as Options<TOption>
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, isLoading },
    setValue,
    reset,
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
  });
  const provinsi = useWatch({
    control,
    name: "province",
  });
  const kota = useWatch({
    control,
    name: "city",
  });

  const getProvinces = async () => {
    const res = await axios.get(
      "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
    );
    const result = res.data;
    const option = result.map((op: any) => ({
      value: Number(op.id),
      label: op.name,
    }));
    setProvinces(option);
  };

  const getCitys = async () => {
    const res = await axios.get(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsi?.value}.json`
    );
    const result = res.data;
    const option = result.map((op: any) => ({
      value: Number(op.id),
      label: op.name,
    }));
    setCities(option);
  };

  const getDistricts = async () => {
    const res = await axios.get(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kota?.value}.json`
    );
    const result = res.data;
    const option = result.map((op: any) => ({
      value: Number(op.id),
      label: op.name,
    }));
    setDistricts(option);
  };
  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (provinsi) {
      setValue("city", null);
      setValue("district", null);
      getCitys();
    }
  }, [provinsi]);

  useEffect(() => {
    if (kota) {
      setValue("district", null);
      getDistricts();
    }
  }, [kota]);

  const onSubmit = async (data: TSchema) => {
    if (!user.id) return;
    const update = {
      phone: data.phone,
      city: data.city,
      district: data.district,
      spesifik_address: data.spesifik,
      provinces: data.province,
      fullname: data.fullname,
    };
    const res = await userService.update(user.id, update);
    if (res.data.statusCode === 200) {
      toast.success(res.data.message);
      reset();
    } else {
      toast.error(res.data.message);
    }
  };

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user.id) return;
    const form = e.target as HTMLFormElement;
    const oldPw = form.old.value;
    const newPw = form.new.value;
    const res = await userService.reset(user.id, {
      old: oldPw,
      new: newPw,
      pw: user.password,
    });
    if (res.data.statusCode === 200) {
      toast.success(res.data.message);
      form.reset();
    } else {
      toast.error(res.data.message);
    }
  };
  return (
    <ProfileLayout>
      <div className="w-full pt-4 pb-24">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="col-span-1 h-fit rounded-md p-4 border-2 border-slate-700 flex flex-col items-center gap-6">
            <h3 className="text-xl font-semibold">AVATAR</h3>
            <Image
              src={
                uploadImage.length > 0
                  ? uploadImage[0]
                  : user?.photo_profile || "/userdefault.png"
              }
              alt={user?.fullname ?? ""}
              width={600}
              height={500}
              className="w-[300px] h-[300px] rounded-full"
              priority
            />
            <p>
              Maximum upload size is <b>1 MB</b>
            </p>
            <Label
              htmlFor="avatar"
              className=" w-full bg-black py-5 rounded-md text-white flex items-center has-[:disabled]:cursor-not-allowed cursor-pointer justify-center"
            >
              <Input
                type="file"
                id="avatar"
                disabled={!(progress !== null && progress < 100)}
                className="hidden"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    const formatFile = file.type.split("/")[1];
                    uploadFile(
                      file,
                      `users/${user.id}/${uuidv4()}.${formatFile}`,
                      setUploadImage,
                      setProgress
                    );
                  }
                }}
              />
              Upload
            </Label>
            <Button
              sizes="md"
              className="text-white self-end disabled:cursor-not-allowed cursor-pointer disabled:bg-opacity-70"
              disabled={uploadImage.length <= 0}
              onClick={async () => {
                const res = await userService.update(user.id, {
                  photo_profile: uploadImage[0],
                });
                if (res.data.status) {
                  toast.success(res.data.message);
                  setUploadImage([]);
                } else {
                  toast.error(res.data.message);
                }
              }}
            >
              Save
            </Button>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="col-span-2 p-4 rounded-md border-2 border-slate-700 flex flex-col gap-5"
          >
            <h3 className="text-xl font-semibold">Profile</h3>
            <div className="flex flex-col gap-3">
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                placeholder="Input your fullname"
                type="text"
                id="fullname"
                {...register("fullname")}
                defaultValue={user?.fullname}
                className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="[hone">Phone</Label>
              <Input
                placeholder="Input your fullname"
                type="text"
                id="phone"
                {...register("phone", { valueAsNumber: true })}
                defaultValue={user?.phone}
                className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="province">Province</Label>
              {user?.provinces ? (
                <Input
                  placeholder="Input your fullname"
                  type="text"
                  id="province"
                  {...register("province", {
                    valueAsNumber: true,
                    value: user.provinces,
                  })}
                  value={user.provinces.label}
                  className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
                  disabled
                />
              ) : (
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        id="province"
                        instanceId={"province"}
                        options={provinces}
                      />
                    );
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="city">City</Label>
              {user?.city ? (
                <Input
                  placeholder="Input your fullname"
                  type="text"
                  id="city"
                  {...register("city", {
                    valueAsNumber: true,
                    value: user.city,
                  })}
                  value={user.city.label}
                  className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
                  disabled
                />
              ) : (
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        id="city"
                        instanceId={"city"}
                        options={cities}
                      />
                    );
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="district">District</Label>
              {user?.district ? (
                <Input
                  placeholder="Input your fullname"
                  type="text"
                  id="district"
                  {...register("district", {
                    valueAsNumber: true,
                    value: user.district,
                  })}
                  value={user.district.label}
                  className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
                  disabled
                />
              ) : (
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        id="district"
                        instanceId={"district"}
                        options={districts}
                      />
                    );
                  }}
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="spesifik_address">Spesifik Address</Label>
              <textarea
                {...register("spesifik")}
                id="spesifik_address"
                className="h-48 resize-none border-2 border-black focus:outline-none px-4 py-3 rounded-md"
                placeholder="Input your full address"
                defaultValue={user?.spesifik_address}
              />
            </div>
            <Button
              type="submit"
              sizes="md"
              className="text-white flex items-center justify-center disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <i className="bx bx-loader-alt text-2xl animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
        <form
          onSubmit={resetPassword}
          className="w-full mt-4 flex flex-col gap-5 p-4 rounded-md border-2 border-slate-700"
        >
          <h3 className="text-xl font-semibold">Reset password</h3>
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
      </div>
    </ProfileLayout>
  );
}

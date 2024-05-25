import { useEffect, useState } from "react";
import Label from "../ui/label";
import Button from "../ui/button";
import { Controller, useForm, useWatch } from "react-hook-form";
import Select, { Options } from "react-select";
import Input from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { schema, TOption, TSchema, User } from "@/types/user";
import userService from "@/services/users";
import { toast } from "sonner";
import { motion } from "framer-motion";
const FormUser = ({ user }: { user: User }) => {
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
    formState: { isSubmitting },
    setValue,
    reset,
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("city", user?.city || null);
    setValue("province", user?.provinces || null);
    setValue("district", user?.district || null);
    setValue("fullname", user?.fullname || "");
    setValue("spesifik", user?.spesifik_address || "");
    setValue("phone", user?.phone || null);
  }, [user]);

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
      phone: data?.phone || user?.phone,
      city: data?.city || user?.city,
      district: data?.district || user?.district,
      spesifik_address: data?.spesifik || user?.spesifik_address,
      provinces: data?.province,
      fullname: data?.fullname || user?.fullname,
    };
    const res = await userService.update(user.id, update);
    if (res.data.statusCode === 200) {
      toast.success(res.data.message);
      reset();
    } else {
      toast.error(res.data.message);
    }
  };
  return (
    <motion.form
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1, transformOrigin: "right" }}
      transition={{ duration: 0.4, delay: 1, ease: [0.24, 0, 0.54, 1] }}
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
          {...register("fullname", {
            value: user?.fullname,
          })}
          defaultValue={user?.fullname}
          className="px-4 py-3 border-b-2 border-b-black focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="phone">Phone</Label>
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
              value: user?.provinces,
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
              value: user?.city,
            })}
            value={user?.city.label}
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
              value: user?.district,
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
    </motion.form>
  );
};

export default FormUser;

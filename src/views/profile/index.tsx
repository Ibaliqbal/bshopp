import ProfileLayout from "@/components/layouts/ProfileLayout";
import Chart from "@/components/Porfile/Chart";
import FormReset from "@/components/Porfile/FormReset";
import FormUser from "@/components/Porfile/FormUser";
import TopThreeProductChart from "@/components/Porfile/TopThreeProductChart";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useUser } from "@/context/user/user.context";
import { uploadFile } from "@/lib/firebase/services";
import userService from "@/services/users";
import { User } from "@/types/user";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

export default function ProfileView() {
  const user: User = useUser();
  const [uploadImage, setUploadImage] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  return (
    <ProfileLayout>
      <div className="w-full pt-4 pb-24">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="md:grid flex flex-col md:grid-cols-3 gap-2 mt-4">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transformOrigin: "left" }}
            transition={{ duration: 0.3, ease: [0.24, 0, 0.54, 1] }}
            className="col-span-1 h-fit rounded-md p-4 border-2 border-slate-700 flex flex-col items-center gap-6"
          >
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
          </motion.div>
          <FormUser user={user} />
        </div>
        <FormReset user={user} />
        <div className="md:grid grid-cols-3 gap-8 mt-5">
          <div className="md:col-span-2">
            <Chart />
          </div>
          <div className="md:col-span-1">
            <TopThreeProductChart />
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}

import AdminLayout from "@/components/layouts/AdminLayout";
import Table from "@/components/ui/table";
import React, { useState } from "react";
import { AlertDelete } from "@/lib/sweetalert/alert";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import userService from "@/services/users";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "@/components/ui/modal";
import Image from "next/image";

const variants = {
  open: {
    scale: 1,
    zIndex: 10,
    transformOrigin: "top right",
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.4,
      duration: 0.5,
      type: "spring",
    },
  },
  closed: {
    scale: 0,
    zIndex: 0,
    transformOrigin: "top right",
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.03,
      duration: 0.5,
      type: "spring",
    },
  },
  exit: {
    scale: 0,
    zIndex: 0,
    transformOrigin: "top right",
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.03,
      duration: 0.5,
      type: "spring",
      delay: 0.4,
    },
  },
};

const listVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const AdminUserView = ({ users }: { users: User[] }) => {
  const queryClient = useQueryClient();
  const [showUser, setShowUser] = useState<User | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState({ id: "", status: false });
  const columnHelper = createColumnHelper<any>();

  const column = [
    columnHelper.accessor("", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "No",
    }),
    columnHelper.accessor("fullname", {
      header: "Full Name",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("", {
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="relative">
            <span>
              <i
                className="bx bx-dots-vertical-rounded text-2xl cursor-pointer"
                onClick={() =>
                  setOpen((prev) => {
                    if (prev.id === user.id) {
                      return {
                        id: "",
                        status: false,
                      };
                    } else {
                      return {
                        id: user.id,
                        status: true,
                      };
                    }
                  })
                }
              />
            </span>
            <AnimatePresence>
              {open.id === user.id && open.status && (
                <motion.div
                  className="bg-white p-4 flex flex-col md:top-4 top-3 md:right-14 right-8 gap-2 absolute rounded-md shadow shadow-slate-900"
                  animate={"open"}
                  initial={"closed"}
                  exit={"exit"}
                  variants={variants}
                >
                  <motion.li
                    variants={listVariants}
                    initial={"closed"}
                    animate={"open"}
                    exit={"closed"}
                    className="font-bold pb-1 border-b-2 border-b-black list-none"
                  >
                    Actions
                  </motion.li>
                  <motion.li
                    variants={listVariants}
                    initial={"closed"}
                    animate={"open"}
                    exit={"closed"}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setOpenModal(true);
                      setShowUser(user);
                      setOpen((prev) => {
                        if (prev.id === user.id) {
                          return {
                            id: "",
                            status: false,
                          };
                        } else {
                          return {
                            id: user.id,
                            status: true,
                          };
                        }
                      });
                    }}
                  >
                    <i className="bx bx-show text-2xl" aria-label="detail" />
                    See
                  </motion.li>
                  <motion.li
                    variants={listVariants}
                    initial={"closed"}
                    animate={"open"}
                    exit={"closed"}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                      AlertDelete(async (result: boolean) => {
                        if (result) {
                          const response = await userService.delete(
                            row.original.id
                          );
                          if (response.status === 200) {
                            toast.success(response.data.message);
                            queryClient.invalidateQueries({
                              queryKey: ["all-users"],
                            });
                          } else {
                            toast.error(response.data.message);
                            queryClient.invalidateQueries({
                              queryKey: ["all-users"],
                            });
                          }
                        } else {
                          toast.error("Canceled");
                        }
                      })
                    }
                  >
                    <i className="bx bx-trash text-xl" aria-label="trash" />
                    Delete
                  </motion.li>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      },
    }),
  ];
  return (
    <section className="w-full">
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        className="flex md:flex-row flex-col items-center gap-5"
      >
        <figure className="w-[300px] h-[300px] relative">
          <Image
            src={
              showUser?.photo_profile
                ? showUser?.photo_profile
                : "/userdefault.png"
            }
            alt="profile"
            fill
            className="object-cover w-full h-full"
          />
        </figure>
        <article className="flex flex-col gap-2 h-full">
          <h1 className="font-semibold text-lg">Detail User</h1>
          <h3>Fullname : {showUser?.fullname}</h3>
          <p>Email : {showUser?.email}</p>
          <p>Province : {showUser?.provinces?.label}</p>
          <p>City : {showUser?.city?.label}</p>
          <p>District : {showUser?.district?.label}</p>
          <p>Phone : 0{showUser?.phone}</p>
          <p>Address : {showUser?.spesifik_address}</p>
        </article>
      </Modal>
      <AdminLayout>
        <Table data={users} columns={column} title="Users Management" />
      </AdminLayout>
    </section>
  );
};

export default AdminUserView;

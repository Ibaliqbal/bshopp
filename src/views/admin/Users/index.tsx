import AdminLayout from "@/components/layouts/AdminLayout";
import Table from "@/components/ui/table";
import React from "react";
import { AlertDelete } from "@/lib/sweetalert/alert";
import { createColumnHelper } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import userService from "@/services/users";

const AdminUserView = ({
  users,
  fetchUser,
}: {
  users: any;
  fetchUser: () => Promise<void>;
}) => {
  const columnHelper = createColumnHelper<any>();
  const session: any = useSession();

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
      header: "Delete",
      cell: ({ row }) => {
        return (
          <button
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            type="button"
            onClick={() =>
              AlertDelete(async (result: boolean) => {
                if (result) {
                  const response = await userService.deleteUser(
                    row.original.id,
                    session.data?.accessToken
                  );
                  if (response.status === 200) {
                    toast.success(response.data.message);
                    fetchUser();
                  } else {
                    toast.error(response.data.message);
                    fetchUser();
                  }
                } else {
                  toast.error("Canceled");
                }
              })
            }
          >
            Delete
          </button>
        );
      },
    }),
  ];
  return (
    <AdminLayout>
      <Table data={users} columns={column} title="Users Management" />
    </AdminLayout>
  );
};

export default AdminUserView;

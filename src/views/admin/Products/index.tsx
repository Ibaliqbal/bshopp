import AdminLayout from "@/components/layouts/AdminLayout";
import Table from "@/components/ui/table";
import { AlertDelete } from "@/lib/sweetalert/alert";
import { productsServices } from "@/services/products";
import { Product } from "@/types/product";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

type AdminProductsViewProps = {
  products: Product[];
  fetchProducts: () => Promise<void>;
};

const AdminProductsView = ({
  fetchProducts,
  products,
}: AdminProductsViewProps) => {
  const columnHelper = createColumnHelper<Product>();
  const session: any = useSession();

  // const column: ColumnDef<Product>[] = [
  //   columnHelper.display({
  //     id: "S.No",
  //     cell: (info) => <span>{info.row.index + 1}</span>,
  //     header: "No",
  //   }),
  //   columnHelper.accessor(`product_name`, {
  //     header: "Name",
  //   }),
  //   columnHelper.accessor("stock", {
  //     header: "Stock",
  //   }),
  //   columnHelper.accessor(`createdAt`, {
  //     header: "Created",
  //     cell: ({ row }) => {
  //       const products = row.original;
  //       const convertDate =
  //         (products.createdAt.nanoseconds +
  //           products.createdAt.seconds * 10 ** -9) *
  //         1000;
  //       const createdAtDate = products.createdAt;
  //       console.log(createdAtDate);
  //       return <span>{products.category}</span>;
  //     },
  //   }),
  //   columnHelper.display({
  //     header: "Delete",
  //     cell: ({ row }) => {
  //       return (
  //         <button
  //           className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
  //           type="button"
  //           onClick={() => AlertDelete(row.original.id, fetchProducts)}
  //         >
  //           Delete
  //         </button>
  //       );
  //     },
  //   }),
  // ];

  const column: ColumnDef<Product>[] = [
    {
      id: "S.No",
      header: "No",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      accessorKey: "photo_product",
      header: "Photo",
      cell: ({ row }) => {
        return (
          <Image
            src={row.original.photo_product[0]}
            alt="Product"
            className="w-[150px] h-[150px] object-cover"
            width={150}
            height={150}
          />
        );
      },
    },
    {
      accessorKey: "name_product",
      header: "Name",
    },
    {
      accessorKey: "categories",
      header: "Category",
      cell: ({ row }) => {
        const products = row.original;
        const convertDate = products.createdAt.seconds * 1000;
        const createdAtDate = new Date(convertDate);
        console.log(createdAtDate);
        return <span>{products.categories?.label}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const createdAtTimestamp: Timestamp = row.getValue("createdAt");
        // const dateCreated = createdAtTimestamp
        //   ? new Date(createdAtTimestamp.seconds * 1000)
        //   : null;
        // const formattedDate = dateCreated
        //   ? dateCreated.toLocaleDateString()
        //   : "Invalid Date";
        return (
          <span>
            {new Date(createdAtTimestamp.seconds * 1000).toDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <button
              className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() =>
                AlertDelete(async (result: boolean) => {
                  if (result) {
                    const response = await productsServices.deleteProduct(
                      row.original.id
                    );
                    if (response.status === 200) {
                      toast.success(response.data.message);
                      fetchProducts();
                    } else {
                      toast.error(response.data.message);
                      fetchProducts();
                    }
                  } else {
                    toast.error("Canceled");
                  }
                })
              }
            >
              Edit
            </button>
            <button
              className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() =>
                AlertDelete(async (result: boolean) => {
                  if (result) {
                    const response = await productsServices.deleteProduct(
                      row.original.id
                    );
                    if (response.status === 200) {
                      toast.success(response.data.message);
                      fetchProducts();
                    } else {
                      toast.error(response.data.message);
                      fetchProducts();
                    }
                  } else {
                    toast.error("Canceled");
                  }
                })
              }
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <AdminLayout>
      <Table data={products} columns={column} title="Products Management" />
    </AdminLayout>
  );
};

export default AdminProductsView;

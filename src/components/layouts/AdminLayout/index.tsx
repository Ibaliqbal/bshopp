import Sidebar from "../SidebarAdmin";
import { SidebarAdminLink } from "@/constant";
import SidebarResponsive from "../SidebarResponsive";
import { signOut } from "next-auth/react";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="w-full h-full flex gap-4 p-4 justify-center relative">
      <Sidebar list={SidebarAdminLink} title="Admin Panel" />
      {children}
      <SidebarResponsive list={SidebarAdminLink} />
      <button
        className="fixed top-2 right-3 p-2 px-3 lg:hidden bg-red-600 rounded-full flex items-center justify-center text-white"
        onClick={() => signOut()}
      >
        <i className="bx bx-door-open text-2xl" />
      </button>
    </div>
  );
};

export default AdminLayout;

import Sidebar from "../SidebarAdmin";
import { SidebarAdminLink } from "@/constant";
import SidebarResponsive from "../SidebarResponsive";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="w-full h-full flex gap-4 p-4 justify-center relative">
      <Sidebar list={SidebarAdminLink} title="Admin Panel" />
      {children}
      <SidebarResponsive list={SidebarAdminLink} />
    </div>
  );
};

export default AdminLayout;

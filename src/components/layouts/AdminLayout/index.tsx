import Sidebar from "../SidebarAdmin";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="w-full h-full flex gap-4 p-4 relative">
      <Sidebar />
      {children}
    </div>
  );
};

export default AdminLayout;

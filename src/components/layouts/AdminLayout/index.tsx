import Sidebar from "../SidebarAdmin";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const list = [
  {
    name: "Dashboard",
    icon: "bxs-dashboard",
    linkTo: "/admin",
  },
  {
    name: "User",
    icon: "bxs-user",
    linkTo: "/admin/users",
  },
  {
    name: "Products",
    icon: "bxs-shopping-bag",
    linkTo: "/admin/products",
  },
  {
    name: "Settings",
    icon: "bxs-cog",
    linkTo: "/admin/settings",
  },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="w-full h-full flex gap-4 p-4 relative">
      <Sidebar list={list} title="Admin Panel" />
      {children}
    </div>
  );
};

export default AdminLayout;

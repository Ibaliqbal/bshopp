import Sidebar from "../SidebarAdmin";

type ProfileLayoutProps = {
  children: React.ReactNode;
};

const list = [
  {
    name: "Profile",
    icon: "bxs-user",
    linkTo: "/profile",
  },
  {
    name: "Cart",
    icon: "bxs-cart-alt",
    linkTo: "/profile/cart",
  },
  {
    name: "Order",
    icon: "bxs-truck",
    linkTo: "/profile/order",
  },
  {
    name: "Favorite",
    icon: "bxs-heart",
    linkTo: "/profile/favorite",
  },
];

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="w-full h-full flex gap-4 p-4 relative">
      <Sidebar list={list} title="Profile Panel" />
      {children}
    </div>
  );
};

export default ProfileLayout;

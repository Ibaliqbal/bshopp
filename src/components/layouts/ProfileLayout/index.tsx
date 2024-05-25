import Sidebar from "../SidebarAdmin";
import { SidebarProfileLink } from "@/constant";
import SidebarResponsive from "../SidebarResponsive";

type ProfileLayoutProps = {
  children: React.ReactNode;
};

const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <main className="w-full h-full flex gap-4 p-4 relative">
      <Sidebar list={SidebarProfileLink} title="Profile Panel" />
      {children}
      <SidebarResponsive list={SidebarProfileLink} />
    </main>
  );
};

export default ProfileLayout;

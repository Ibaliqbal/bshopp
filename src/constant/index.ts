export const MONTH = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export enum TRANSACTION_TYPE {
  PAID,
  PENDING,
  CANCELED,
}

export const SidebarProfileLink = [
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

export const SidebarAdminLink = [
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
    name: "Orders",
    icon: "bxs-truck",
    linkTo: "/admin/orders",
  },
];

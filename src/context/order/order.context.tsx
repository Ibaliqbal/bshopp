import { firestore } from "@/lib/firebase/services";
import { User } from "@/types/user";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useUser } from "../user/user.context";

type OrderContextType = {
  order: any[];
};

export const OrderContext = React.createContext<OrderContextType>({
  order: [],
});

export const OrderProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [order, setOrder] = React.useState<any[]>([]);
  const user: User = useUser();
  React.useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(firestore, "checkouts"),
        where("user_id", "==", user?.id ?? "")
      ),
      (snapshot) => {
        const checkouts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (checkouts) {
          setOrder(checkouts);
        }
      }
    );
    return () => {
      unsub();
    };
  }, [user]);

  return (
    <OrderContext.Provider value={{ order }}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => {
  const data = React.useContext(OrderContext);

  return data.order;
};

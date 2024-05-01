import { firestore } from "@/lib/firebase/services";
import { User } from "@/types/user";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import * as React from "react";

type OrderContextType = {
  order: any[] | undefined;
};

export const OrderContext = React.createContext<OrderContextType>({
  order: [],
});

export const OrderProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [order, setOrder] = React.useState<any[] | undefined>([]);
  const { data } = useSession();
  React.useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(firestore, "users"),
        where("email", "==", data?.user?.email ?? "")
      ),
      (snapshot) => {
        const findUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (findUsers) {
          const data = findUsers[0] as User;
          setOrder(data?.order);
        }
      }
    );
    return () => {
      unsub();
    };
  }, [data]);

  return (
    <OrderContext.Provider value={{ order }}>{children}</OrderContext.Provider>
  );
};

export const useOrder = () => {
  const data = React.useContext(OrderContext);

  return data.order;
};

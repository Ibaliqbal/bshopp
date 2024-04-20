import Drawer from "@/components/ui/drawer";
import { useCart } from "@/context/cart/cart.context";
import * as React from "react";

export default function CartModal() {
  const cart = useCart();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="relative" onClick={() => setOpen((prev) => !prev)}>
        <i className="bx bx-cart-alt text-3xl" />
        {cart?.length || 0 > 0 ? (
          <span className="w-6 h-6 text-center rounded-full bg-red-500 absolute left-4">
            {cart?.length}
          </span>
        ) : null}
      </button>
      <Drawer open={open} setOpen={setOpen}>
        <div className="mx-auto max-w-2xl space-y-4 text-neutral-400">
          <h2 className="text-4xl font-bold text-neutral-200">
            Drag the handle at the top of this modal downwards 100px to close it
          </h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
            laboriosam quos deleniti veniam est culpa quis nihil enim suscipit
            nulla aliquid iure optio quaerat deserunt, molestias quasi facere
            aut quidem reprehenderit maiores.
          </p>
          <p>
            Laudantium corrupti neque rerum labore tempore sapiente. Quos, nobis
            dolores. Esse fuga, cupiditate rerum soluta magni numquam nemo
            aliquid voluptate similique deserunt!
          </p>
          <p>
            Rerum inventore provident laboriosam quo facilis nisi voluptatem
            quam maxime pariatur. Velit reiciendis quasi sit magni numquam quos
            itaque ratione, fugit adipisci atque est, tenetur officiis explicabo
            id molestiae aperiam? Expedita quidem inventore magni? Doloremque
            architecto mollitia, dicta, fugit minima velit explicabo sapiente
            beatae fugiat accusamus voluptatum, error voluptatem ab asperiores
            quo modi possimus.
          </p>
          <p>
            Sit laborum molestias ex quisquam molestiae cum fugiat praesentium!
            Consequatur excepturi quod nemo harum laudantium accusantium nisi
            odio?
          </p>
          <p>
            Deleniti, animi maiores officiis quos eaque neque voluptas omnis
            quia error a dolores, pariatur ad obcaecati, vitae nisi perspiciatis
            fugiat sapiente accusantium. Magnam, a nihil soluta eos vero illo ab
            sequi, dolores culpa, quia hic?
          </p>
          <p>
            Eos in saepe dignissimos tempore. Laudantium cumque eius, et
            distinctio illum magnam molestiae doloribus. Fugiat voluptatum
            necessitatibus vero eligendi quae, similique non debitis qui veniam
            praesentium rerum labore libero architecto tempore nesciunt est
            atque animi voluptatibus. Aliquam repellendus provident tempora
            sequi officia sint voluptates eaque minima suscipit, cum maiores
            quos possimus. Vero ex porro asperiores voluptas voluptatibus?
          </p>
          <p>
            Debitis eos aut ullam odit fuga. Numquam deleniti libero quas sunt?
            Exercitationem earum odio aliquam necessitatibus est accusamus
            consequuntur nisi natus dolore libero voluptatibus odit doloribus
            laudantium iure, dicta placeat molestias porro quasi amet? Sint,
            reiciendis tenetur distinctio eaque delectus, maiores, nihil
            voluptas dolorem necessitatibus consequatur aliquid?
          </p>
          <p>
            Sunt ex, cum culpa vel odio dicta expedita omnis amet debitis
            inventore necessitatibus quaerat est molestias delectus. Dolorem,
            eius? Quae, itaque ipsa incidunt nobis repellendus, sunt dolorum
            aliquam ad culpa repudiandae impedit omnis, expedita illum voluptas
            delectus similique ducimus saepe pariatur. Molestias similique quam
            dolore provident doloremque maiores autem ab blanditiis voluptatum
            dignissimos culpa sed nesciunt laboriosam, in dicta consectetur.
          </p>
          <p>
            Voluptates ea, aspernatur possimus, iusto temporibus non laudantium
            neque molestias rem tempore eligendi earum nisi dolorum asperiores
            at rerum!
          </p>
          <p>
            Eaque totam error quia, ut eius perspiciatis unde velit temporibus
            mollitia. Aperiam ad tempora aliquam est molestias commodi
            cupiditate quos impedit nostrum accusantium quo fugit eveniet
            temporibus quam cumque autem porro, id ut debitis itaque et nemo
            exercitationem voluptatibus? Aspernatur corrupti quas iusto dolores
            nemo pariatur debitis quae dolorem! Nemo, eius? Dolorem quam nemo
            magnam ratione deserunt aperiam. Voluptatum ipsa, molestias
            aspernatur quas distinctio numquam qui laboriosam id ab totam
            commodi laborum tempora error natus vitae eligendi reiciendis
            maiores ex illo? Tempore at animi earum vitae enim sunt,
            dignissimos, mollitia corrupti officia obcaecati error iure vero
            repudiandae nihil magni molestias quibusdam dolorem aperiam modi.
            Harum, fugit.
          </p>
        </div>
      </Drawer>
    </>
  );
}

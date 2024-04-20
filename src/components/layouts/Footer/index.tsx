import React from "react";
import { Ubuntu, Montserrat } from "next/font/google";
import Link from "next/link";

const ubuntu = Ubuntu({
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin", "cyrillic"],
  style: "italic",
});

export default function Footer() {
  return (
    <footer className="bg-black text-white pb-10">
      <div className="max-w-layout mx-auto md:p-4 p-8 grid md:grid-cols-2 place-items-center gap-6">
        <section className="w-full">
          <div className="flex items-center justify-between">
            <h1 className={`${montserrat.className} text-3xl`}>BShopp</h1>
            <ul className="flex items-center gap-3">
              <li>
                <a
                  href="http://instagram.com/muthahhary_iqbal?igshid=MzNlNGNkZWQ4Mg=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-instagram text-3xl" />
                </a>
              </li>
              <li>
                <i className="bx bxl-tiktok text-3xl" />
              </li>
              <li>
                <a
                  href={`https://api.whatsapp.com/send?phone=${
                    process.env.PHONE || ""
                  }&text=Halo saya ingin berbicara dengan Iqbal Muthahhary`}
                  target="_blank"
                >
                  <i className="bx bxl-whatsapp text-3xl" />
                </a>
              </li>
            </ul>
          </div>
          <p
            className={`${ubuntu.className} text-lg mt-5 leading-relaxed indent-8 whitespace-normal text-justify`}
          >
            BShopp merupakan destinasi utama bagi siapa saja yang mencari
            aksesori berkualitas tinggi, menawarkan koleksi luas yang mencakup
            segala sesuatu dari perhiasan klasik hingga aksesori modern terkini.
            Dengan fokus pada kepuasan pelanggan, kami berkomitmen untuk
            menyediakan produk yang tidak hanya mengikuti tren terbaru tetapi
            juga menawarkan kenyamanan dan durabilitas. Baik Anda mencari
            aksesori untuk diri sendiri, hadiah untuk orang terkasih, atau
            barang-barang khusus untuk acara tertentu, BShopp adalah tempat yang
            sempurna untuk menemukan segala yang Anda butuhkan.
          </p>
        </section>
        <section className="w-full h-full grid md:grid-cols-2 md:px-5">
          <div className="w-full">
            <h4>NAVIGATIONS</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href={"/"}>Home</Link>
              </li>
              <li>
                <Link href={"/products"}>Products</Link>
              </li>
            </ul>
          </div>
          <div className="w-full flex flex-col">
            <h4>Developer</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li>Iqbal Muthahhary</li>
              <li>iqbalmuthahhary@gmail.com</li>
            </ul>
            <h5 className="mt-3 font-semibold">Sosial Media</h5>
            <ul className="flex items-center gap-2 mt-2">
              <li>
                <a
                  href="http://instagram.com/muthahhary_iqbal?igshid=MzNlNGNkZWQ4Mg=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-instagram text-2xl" />
                </a>
              </li>
              <li>
                <i className="bx bxl-tiktok text-2xl" />
              </li>
              <li>
                <a
                  href={`https://api.whatsapp.com/send?phone=${process.env.PHONE}&text=Halo saya ingin berbicara dengan Iqbal Muthahhary`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-whatsapp text-2xl" />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </footer>
  );
}

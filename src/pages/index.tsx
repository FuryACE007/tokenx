import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className=" text-xl bg-slate-100 text-black" > Hello Devs!</div>
  );
}

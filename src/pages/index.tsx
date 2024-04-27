"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-lg font-medium tracking-tight text-transparent md:text-4xl leading-loose"
        >
          Unlock Infinite Possibilities: Create SPL <br />
          Tokens Effortlessly! <br />
          <button
            className="mt-4 px-8 py-2 hover:shadow-cyan-600 hover:text-cyan-500 hover:shadow-md text-slate-300 font-thin border-cyan-500 border-2 transition-all text-lg"
            onClick={() => router.push("/token-creation")}
          >
            {" "}
            Try Now{" "}
          </button>
        </motion.h1>
      </LampContainer>
    </>
  );
}

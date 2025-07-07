"use client";

import React from "react";
import { motion } from "framer-motion";
//import { motion } from "motion/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";

function FirstSection() {
  const { isSignedIn } = useUser();

  return (
    <main className="flex-grow flex flex-col items-center justify-center relative">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-3 md:py-20">
        <div className="flex justify-center mb-4">
          <Image
            src={"/image/doctor-character.png"}
            alt="의사 캐릭터"
            width={200}
            height={200}
          ></Image>
        </div>

        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-4xl font-bold text-slate-700 md:text-4xl lg:text-3xl dark:text-slate-300">
          {"AI 의사에게 상담 받으세요.".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          증상을 간단히 말씀해 보세요. AI의사는 24시간 상담이 가능합니다.
        </motion.p>

        <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {isSignedIn ? (
              <Button className="w-60 transform transition-all duration-300 hover:-translate-y-0.5">
                AI의사에게 상담받기 <IconArrowRight />
              </Button>
            ) : (
              <Button
                className="w-60 transform transition-all duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: "black", color: "white" }}
              >
                시작하기
              </Button>
            )}
          </motion.div>
        </Link>
      </div>
    </main>
  );
}

export default FirstSection;

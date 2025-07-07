"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import AppFooter from "@/components/common/AppFooter";
import FirstSection from "@/components/home/FirstSection";
import StepsSection from "@/components/home/StepsSection";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <FirstSection />
      <StepsSection />
      <AppFooter />
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-bold md:text-2xl">
          <Image src={"/image/logo.svg"} alt="empty" width={150} height={150} />
        </h1>
      </div>
      {!user ? (
        <Link href={"/sign-in"}>
          <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            로그인
          </button>
        </Link>
      ) : (
        <div className="flex gap-5 items-center">
          <UserButton />
        </div>
      )}
    </nav>
  );
};

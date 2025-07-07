import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const menuOptions = [
  {
    id: 1,
    name: "홈",
    path: "/",
  },
  {
    id: 2,
    name: "대시보드",
    path: "/dashboard",
  },
  {
    id: 3,
    name: "상담기록",
    path: "/history",
  },
];

function AppHeader() {
  return (
    <div className="flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40">
      <Link href="/dashboard">
        <Image
          src={"/image/logo.svg"}
          alt="logo"
          width={150}
          height={90}
          className="cursor-pointer"
        />
      </Link>
      <div className="hidden md:flex gap-15 items-center">
        {menuOptions.map((option, index) => (
          <Link key={index} href={option.path}>
            <h2 className="hover:font-bold cursor-pointer transition-all hover:text-[#09C382]">
              {option.name}
            </h2>
          </Link>
        ))}
      </div>
      <UserButton />
    </div>
  );
}

export default AppHeader;

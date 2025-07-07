import React from "react";
import { doctorAgent } from "./AIDoctorCard";
import Image from "next/image";

type props = {
  doctorAgent: doctorAgent;
  setSelectedDoctor: any;
  selectedDoctor: doctorAgent | null;
};

function SuggestedDoctorCard({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: props) {
  return (
    <div
      className={`flex flex-col items-center
    border rounded-2xl shadow p-5
     hover:border-[#09C382] cursor-pointer
     ${selectedDoctor?.id == doctorAgent?.id && "border-[#09C382]"}`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={
          doctorAgent?.image || `/image/AIDoctor/AIDoctor${doctorAgent?.id}.png`
        }
        alt={doctorAgent?.specialist}
        width={70}
        height={70}
        className="w-[70px] h-[70px] rounded-4xl object-cover"
      />
      <h2 className="font-bold text-sm text-center">
        {doctorAgent?.specialist}
      </h2>
      <p className="text-xs text-center line-clamp-2">
        {doctorAgent?.description}
      </p>
    </div>
  );
}

export default SuggestedDoctorCard;

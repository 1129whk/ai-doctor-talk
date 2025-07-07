"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
};

type props = {
  doctorAgent: doctorAgent;
};

function AIDoctorCard({ doctorAgent }: props) {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onStartConsultation = async () => {
    setLoading(true);

    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: doctorAgent,
      });

      console.log("세션 시작 응답:", result.data);

      if (result.data?.sessionId) {
        console.log("세션 ID:", result.data.sessionId);
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      } else {
        alert("상담을 시작할 수 없습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("상담 세션 시작 중 오류 발생:", error);
      alert("상담을 시작하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover rounded-x"
      />
      <h2 className="font-bold">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 mt-1 text-sm h-10 overflow-hidden">
        {doctorAgent.description}
      </p>
      <Button className="w-full mt-2" onClick={onStartConsultation}>
        상담 시작 <IconArrowRight />
      </Button>
    </div>
  );
}

export default AIDoctorCard;

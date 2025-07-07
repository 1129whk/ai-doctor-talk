"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import type { doctorAgent } from "./AIDoctorCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent | null>(
    null
  );
  const router = useRouter();

  // 다이얼로그 닫힐 때 상태를 초기화
  const resetDialogState = (isOpen: boolean) => {
    if (!isOpen) {
      setNote("");
      setSuggestedDoctors([]);
      setSelectedDoctor(null);
      setLoading(false);
    }
  };

  const OnClickNext = async () => {
    if (!note.trim()) {
      alert("증상이나 참고할만한 정보를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      console.log("API 응답 데이터:", result.data);

      let doctorsArray: doctorAgent[] = [];

      if (typeof result.data === "object" && result.data !== null) {
        for (const key in result.data) {
          if (Array.isArray(result.data[key])) {
            doctorsArray = result.data[key];
            break;
          }
        }
      }

      if (doctorsArray.length > 0) {
        setSuggestedDoctors(doctorsArray);
      } else {
        console.warn("유효한 AI의사가 없습니다", result.data);
        setSuggestedDoctors([]);
      }
    } catch (error) {
      console.error("의사 추천 중 오류 발생:", error);
      setSuggestedDoctors([]);
      alert("요금 부과 등의 이유로 의사 추천 서비스를 이용할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    if (!selectedDoctor) {
      alert("상담할 AI의사를 선택해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: selectedDoctor,
      });

      console.log("세션 시작 응답:", result.data);

      if (result.data?.sessionId) {
        console.log("세션 ID:", result.data.sessionId);
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      } else {
        alert("상담을 시작할 수 없습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("상담 시작 중 오류 발생:", error);
      alert("상담을 시작하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Dialog onOpenChange={resetDialogState}>
        <Image
          src={"/image/doctor-character.png"}
          alt="의사 캐릭터"
          width={170}
          height={170}
        ></Image>
        <DialogTrigger asChild>
          <Button className="mt-3">
            AI의사 추천 받기 <IconArrowRight />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-screen-md">
          <DialogHeader>
            <DialogTitle>
              {suggestedDoctors.length === 0 && !loading
                ? "증상 추가하기"
                : "AI의사 선택하기"}
            </DialogTitle>
            <DialogDescription asChild>
              {loading ? (
                <div className="flex justify-center items-center h-[200px] flex-col">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="mt-2 text-gray-600">
                    AI 의사를 찾는 중입니다...
                  </span>
                </div>
              ) : suggestedDoctors.length === 0 ? (
                <div>
                  <h2>
                    증상이나 참고할만한 정보를 말씀해 주시면 알맞은 분야의
                    AI의사를 추천해 드립니다.
                  </h2>
                  <Textarea
                    placeholder="예시) 만성두통이 있어요. 증상 완화를 위한 방법을 알려주세요."
                    className="h-[200px] mt-1"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    spellCheck="false"
                  />
                </div>
              ) : (
                <div>
                  <h2>AI 의사 선택하기</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 py-4">
                    {suggestedDoctors.map((doctor, index) => (
                      <SuggestedDoctorCard
                        doctorAgent={doctor}
                        key={index}
                        setSelectedDoctor={() => setSelectedDoctor(doctor)}
                        selectedDoctor={selectedDoctor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>취소</Button>
            </DialogClose>

            {suggestedDoctors.length === 0 ? (
              <Button disabled={!note.trim() || loading} onClick={OnClickNext}>
                다음
                {loading ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            ) : (
              <Button
                disabled={loading || !selectedDoctor}
                onClick={onStartConsultation}
              >
                상담 시작
                {loading ? (
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewSessionDialog;

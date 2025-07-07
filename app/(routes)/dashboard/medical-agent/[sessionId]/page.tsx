"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { doctorAgent } from "@/components/doctor/AIDoctorCard";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// VAPI 음성 AI 부분
import Vapi from "@vapi-ai/web";

import { toast } from "sonner";

export type ReportDetail = {
  agent?: string;
  user?: string;
  timestamp?: string;
  chiefComplaint?: string;
  summary?: string;
  symptoms?: string[];
  duration?: string;
  severity?: string;
  medicationsMentioned?: string[];
  recommendations?: string[];
};

export type SessionDetail = {
  id: number;
  session: string;
  notes: string;
  sessionId: string;
  report: ReportDetail;
  selectedDoctor: doctorAgent;
  createOn: string;
  symtoms: string;
};

type messages = {
  role: string;
  text: string;
};

// VAPI 음성 AI 관련 부분
function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const [vapiInstance, setVapiInstance] = useState<any | null>(null);
  const [currnetRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 통화 시간 포맷
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const handleCallStart = useCallback(() => {
    console.log("Call started");
    setCallStarted(true);
  }, []);

  const handleCallEnd = useCallback(() => {
    setCallStarted(false);
    console.log("Call ended");
  }, []);

  const handleMessage = useCallback((message: any) => {
    if (message.type === "transcript") {
      const { role, transcriptType, transcript } = message;
      console.log(`${message.role}: ${message.transcript}`);
      if (transcriptType === "partial") {
        setLiveTranscript(transcript);
        setCurrentRole(role);
      } else if (transcriptType === "final") {
        setMessages((prev) => [...prev, { role: role, text: transcript }]);
        setLiveTranscript("");
        setCurrentRole(null);
      }
    }
  }, []);

  const handleSpeechStart = useCallback(() => {
    console.log("Assistant started speaking");
    setCurrentRole("AI의사");
  }, []);

  const handleSpeechEnd = useCallback(() => {
    console.log("Assistant stopped speaking");
    setCurrentRole("나");
  }, []);

  // 통화 시간 카운트업
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (callStarted) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else if (!callStarted && timer) {
      clearInterval(timer);
      timer = null;
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [callStarted]);

  // ✨ 이펙트: 컴포넌트 언마운트 시 VAPI 연결 정리 (보고서 생성 없이)
  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 (즉, 페이지를 벗어날 때) 실행됩니다.
      if (callStarted && vapiInstance) {
        console.log(
          "페이지를 벗어나 통화를 강제 종료합니다. 보고서는 생성되지 않습니다."
        );
        // Vapi 이벤트 리스너 해제
        vapiInstance.off("call-start", handleCallStart);
        vapiInstance.off("call-end", handleCallEnd);
        vapiInstance.off("message", handleMessage);
        vapiInstance.off("speech-start", handleSpeechStart);
        vapiInstance.off("speech-end", handleSpeechEnd);

        vapiInstance.stop(); // VAPI 통화 중지

        // 보고서는 여기서 생성하지 않습니다.
        setCallStarted(false); // 상태 업데이트 (선택 사항이지만 일관성을 위해)
        setVapiInstance(null);
        setCallDuration(0);
      }
    };
  }, [
    callStarted,
    vapiInstance,
    handleCallStart,
    handleCallEnd,
    handleMessage,
    handleSpeechStart,
    handleSpeechEnd,
  ]);

  const GetSessionDetails = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "/api/session-chat?sessionId=" + sessionId
      );
      setSessionDetail(result.data);
    } catch (error) {
      console.error("Failed to fetch session details:", error);
    } finally {
      setLoading(false);
    }
  };

  // VAPI 음성 AI 부분
  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    console.log("voiceId 테스트: " + sessionDetail?.selectedDoctor?.voiceId);

    // VAPI 설정사항
    const VapiAgentConfig = {
      name: "AI의사 목소리",
      firstMessage: "안녕하세요. 증상을 얘기해주세요. 또는 상담이 필요하세요?",
      // 음성 번역
      transcriber: {
        provider: "google",
        language: "Korean",
      },
      voice: {
        provider: "vapi",
        voiceId: sessionDetail?.selectedDoctor?.voiceId ?? "Spencer",
      },
      model: {
        // 사용자와 대화
        provider: "openai",
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    // 통화 시작
    //@ts-ignore
    vapi.start(VapiAgentConfig);

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);

    // Vapi 오류 발생 시 처리
    vapi.on("error", async (error: any) => {
      console.error("Vapi 오류 발생:", error);
      toast.error("통화 중 오류가 발생했습니다. 현재까지의 대화를 저장합니다.");
      // 오류 발생 시에도 보고서 생성 시도
      if (messages.length > 0 && sessionId && sessionDetail) {
        try {
          await GenerateReport();
          toast.success(
            "오류 발생가 발생했지만, 보고서는 성공적으로 작성되었습니다."
          );
        } catch (reportError) {
          console.error("오류 발생 시 보고서 생성 실패:", reportError);
          toast.error("보고서 생성 중 오류가 발생했습니다.");
        }
      } else {
        console.log("저장할 대화가 없거나 정보가 부족합니다.");
      }
      // 통화 상태 및 Vapi 인스턴스 초기화
      setCallStarted(false);
      setVapiInstance(null);
      setCallDuration(0);
    });

    toast.info("AI 의사와의 통화를 시작합니다!");
  };

  const endCall = async () => {
    setLoading(true);
    if (!vapiInstance) {
      console.error("Vapi instance is not available.");
      setLoading(false);
      toast.error("통화를 종료할 수 없습니다. Vapi 인스턴스가 없습니다.");
      return;
    }

    vapiInstance.off("call-start", handleCallStart);
    vapiInstance.off("call-end", handleCallEnd);
    vapiInstance.off("message", handleMessage);
    vapiInstance.off("speech-start", handleSpeechStart);
    vapiInstance.off("speech-end", handleSpeechEnd);

    vapiInstance.stop();

    try {
      await GenerateReport();
      toast.success("보고서가 작성되었습니다!");
      router.replace("/dashboard");
    } catch (error) {
      console.error("보고서 생성 중 오류 발생:", error);
      toast.error("보고서 생성 중 오류가 발생했습니다.");
    } finally {
      setCallStarted(false);
      setVapiInstance(null);
      setLoading(false);
      setCallDuration(0);
    }
  };

  const GenerateReport = async () => {
    try {
      const result = await axios.post("/api/medical-report", {
        messages: messages,
        sessionDetail: sessionDetail,
        sessionId: sessionId,
      });
      console.log("보고서: ", result.data);
      return result.data;
    } catch (error) {
      console.error("보고서 생성 중 오류 발생:", error);
      throw error;
    }
  };

  // 대시보드로 이동하는 핸들러 함수 수정
  const goToDashboard = useCallback(() => {
    setLoading(true); // 로딩 상태 시작
    toast.info("대시보드로 이동합니다. 보고서는 생성되지 않습니다.");
    router.push("/dashboard"); // 대시보드로 이동
    setLoading(false); // 로딩 상태 종료
  }, [router]);

  if (loading && !sessionDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-[#09C382]" />
        <p className="ml-2">정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!sessionDetail) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${
              callStarted ? "bg-[#09C382]" : "bg-red-500"
            } `}
          />
          {callStarted ? "통화 연결 중..." : "통화 시작 전"}
        </h2>
        <h2 className="font-bold text-xl text-gray-500">
          {formatTime(callDuration)}
        </h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist ?? ""}
            width={120}
            height={120}
            className="h-[200px] w-[200px] object-cover rounded-full"
          />
          <h2 className="mt-2 text-lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-500">AI 의사 목소리</p>

          <div className="mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((msg: messages, index) => (
              <h2 className="text-gray-500 p-2" key={index}>
                {msg.role}: {msg.text}
              </h2>
            ))}
            {liveTranscript && liveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currnetRole}: {liveTranscript}
              </h2>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 mt-1.5">
            {!callStarted ? (
              <Button className="mt-1.5" onClick={StartCall} disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : <PhoneCall />}
                통화 시작
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                onClick={endCall}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin" /> : <PhoneOff />}
                통화 종료
              </Button>
            )}
            <Button
              onClick={goToDashboard}
              className="mt-1.5"
              style={{ backgroundColor: "black", color: "white" }}
              disabled={loading}
            >
              뒤로가기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;

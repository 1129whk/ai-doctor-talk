"use client";

import React from "react";
import Image from "next/image";
import { Loader } from "lucide-react";

interface HistoryStatusDisplayProps {
  loading: boolean;
  historyListLength: number;
  highstPercentageItems: string;
}

function HistoryStatusDisplay({
  loading,
  historyListLength,
  highstPercentageItems,
}: HistoryStatusDisplayProps) {
  if (loading) {
    return (
      <div className="flex items-center flex-col justify-center p-10 border-dashed rounded-2xl border-2">
        <Loader className="animate-spin h-10 w-10 text-[#09C382]" />
        <h2 className="font-bold text-xl mt-5">상담기록 불러오는 중...</h2>
      </div>
    );
  }

  if (historyListLength === 0) {
    return (
      <div className="flex items-center flex-col justify-center p-10  border-dashed rounded-2xl border-2">
        <Image
          src={"/image/medical-help.png"}
          alt="empty"
          width={150}
          height={150}
        />
        <h2 className="font-bold text-xl mt-5">최근 상담기록 없음</h2>
      </div>
    );
  }
  return null; // 로딩도 아니고 기록도 없으면 아무것도 렌더링하지 않음.
}

export default HistoryStatusDisplay;

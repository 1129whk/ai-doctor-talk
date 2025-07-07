"use client";

import React, { useMemo } from "react";
import HistoryTable from "./HistoryTable";
import HistoryChart from "./HitoryChart";

import { useChartData } from "@/hooks/useChartData";
import HistoryStatusDisplay from "./HistoryStatusDisplay";

function HistoryList() {
  const { historyList, chartData, loading } = useChartData();

  const highstPercentageItems = useMemo(() => {
    if (loading) {
      return "집계 중입니다.";
    }

    if (!chartData || chartData.length === 0) {
      return "상담기록이 없습니다.";
    }

    const highestValue = chartData[0].value;

    // 가장 높은 value를 가진 모든 항목을 필터링
    const items = chartData.filter((item) => item.value === highestValue);

    // 항목 이름을 추출하고, 쉼표로 연결
    const itemNames = items.map((item) => item.name).join(", ");
    return `${itemNames} 상담을 가장 많이 요청하셨네요!`;
  }, [chartData, loading]); // chartData가 변경될 때만 다시 계산

  const shouldDisplayStatus = loading || historyList.length === 0;

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-[#09C382] mb-3 text-2xl">
          상담기록
          {highstPercentageItems && (
            <p className="text-gray-600 dark:text-gray-400 font-semibold">
              {highstPercentageItems}
            </p>
          )}
        </h2>
      </div>

      {shouldDisplayStatus ? (
        <HistoryStatusDisplay
          loading={loading}
          historyListLength={historyList.length}
          highstPercentageItems={highstPercentageItems}
        />
      ) : (
        // ✨ 데이터가 있을 때만 차트와 테이블 렌더링
        <div className="flex flex-col gap-5">
          <HistoryChart chartData={chartData} />
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
}

export default HistoryList;

// hooks/useChartData.ts
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { SessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page"; // SessionDetail 타입 경로에 따라 수정 필요

export interface ChartDataItem {
  name: string;
  value: number;
}

interface UseChartDataResult {
  chartData: ChartDataItem[];
  historyList: SessionDetail[];
  loading: boolean;
  error: any;
  GetHistoryList: () => Promise<void>; // 데이터를 다시 불러올 함수
}

export function useChartData(): UseChartDataResult {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    setLoading(true);
    setError(null); // 새로운 요청 전 에러 초기화
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      console.log(result.data);
      setHistoryList(result.data);
    } catch (err) {
      console.error("상담 기록 불러오기 실패:", err);
      setError(err); // 에러 상태 저장
    } finally {
      setLoading(false);
    }
  };

  // AI 의사별 상담 건수를 계산하여 차트 데이터로 변환
  const chartData = useMemo(() => {
    if (!historyList || historyList.length === 0) return [];

    const specialistCounts = historyList.reduce((acc, record) => {
      let specialistName = record.selectedDoctor?.specialist || "알 수 없음";

      switch (specialistName) {
        case "내과 의사":
          specialistName = "내과";
          break;
        case "소아과 의사":
          specialistName = "소아과";
          break;
        case "심리의학자":
          specialistName = "심리학";
          break;
        case "심장 전문의":
          specialistName = "심장외과";
          break;
        case "안과 의사":
          specialistName = "안과";
          break;
        case "알 수 없음":
          specialistName = "분류없음";
          break;
        case "영양사":
          specialistName = "영양의학";
          break;
        case "이비인후과 전문의":
          specialistName = "이비인후과";
          break;
        case "정형외과 의사":
          specialistName = "정형외과";
          break;
        case "치과 의샤":
          specialistName = "치과";
          break;
        case "피부과 의사":
          specialistName = "피부과";
          break;
        default:
          break;
      }

      acc[specialistName] = (acc[specialistName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rawData = Object.entries(specialistCounts).map(([name, value]) => ({
      name,
      value,
    }));

    const sortedData = rawData.sort((a, b) => b.value - a.value);

    return sortedData;
  }, [historyList]);

  return { chartData, historyList, loading, error, GetHistoryList };
}

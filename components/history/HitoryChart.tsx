"use client";

import React from "react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Text,
} from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

interface HistoryChartProps {
  chartData: ChartDataItem[];
}

function HistoryChart({ chartData }: HistoryChartProps) {
  // 각 조각에 할당될 색상들을 정의 (명확하게 구분되는 색상들)
  const COLORS = [
    "#DC143C", // 크림슨 (빨강)
    "#FFD700", // 금색 (노랑)
    "#32CD32", // 라임 그린 (초록)
    "#1E90FF", // 돗져 블루 (파랑)
    "#8A2BE2", // 블루 바이올렛 (남색/보라)
    "#FF4500", // 진한 주황
    "#808080", // 회색
    "#D8BFD8", // 연한 보라색 (Thistle)
    "#FF69B4", // 핫 핑크
    "#4682B4", // 스틸 블루
    "#00BFFF", // 딥스카이블루
    "#A52A2A", // 진한 갈색
  ];

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value,
  }: any) => {
    // 라벨 위치 설정
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    const percentageText = `(${(percent * 100).toFixed(0)}%)`;

    return (
      <g>
        <Text
          x={x}
          y={y - 10} // 이름을 비율보다 위로 올리기 위해 y 값 조정
          fill="black"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "14px", fontWeight: "bold" }} // 이름 텍스트 크기
        >
          {name}
        </Text>
        <Text
          x={x}
          y={y + 10} // 비율을 이름보다 아래로 내리기 위해 y 값 조정
          fill="black"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "12px" }} // 비율 텍스트 크기
        >
          {percentageText}
        </Text>
      </g>
    );
  };

  return (
    <div className="p-5 border rounded-2xl shadow-sm bg-white dark:bg-gray-800">
      {/* ResponsiveContainer로 부모 요소에 맞춰 그래프 크기 조절 */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData} // 가공된 데이터
            cx="50%" // x축 중심
            cy="50%" // y축 중심
            innerRadius={80} // 도넛 차트의 안쪽 반지름
            outerRadius={140} // 도넛 차트의 바깥쪽 반지름
            fill="#8884d8" // 기본 채우기 색상 (각 Cell에서 재정의됨)
            paddingAngle={5} // 각 조각 사이의 간격
            dataKey="value" // 차트 조각의 크기를 결정하는 데이터 키
            // 각 조각에 표시될 라벨 형식: '전문의 이름 (비율%)'
            label={renderCustomLabel}
            labelLine={false} // 라벨과 조각을 잇는 선 제거
            startAngle={90} // 시작 각도
            endAngle={-90 - 360} // 끝 각도
          >
            {/* 각 조각에 COLORS 배열의 색상 적용 */}
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}명`} />
          {/* 마우스 오버 시 데이터 정보 표시 */}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// 커스텀 라벨 (파이차트 조각 중앙에 표시)

export default HistoryChart;

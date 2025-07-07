import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page";
import moment from "moment";
import ViewReportDialog from "./ViewReportDialog";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

type Props = {
  historyList: SessionDetail[];
};

function HistoryTable({ historyList }: Props) {
  const pathname = usePathname();

  // 한 페이지당 보여줄 행 수
  const ITEMS_PER_PAGE = pathname === "/dashboard" ? 3 : 10;

  // 현재 페이지 상태 관리 (기본값은 1페이지)
  const [currentPage, setCurrentPage] = useState(1);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(historyList.length / ITEMS_PER_PAGE);

  // 현재 페이지에 해당하는 데이터만 잘라내기
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHistoryList = historyList.slice(startIndex, endIndex);

  // 이전 페이지로 이동
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // 맨 앞 페이지로 이동
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  // 맨 뒤 페이지로 이동
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-blue-500">
              AI 의사 분야
            </TableHead>
            <TableHead className="font-bold text-blue-500">설명</TableHead>
            <TableHead className="font-bold text-blue-500">일자</TableHead>
            <TableHead className="font-bold text-blue-500 text-right">
              상담기록
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentHistoryList.map((record: SessionDetail) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {record.selectedDoctor?.specialist}
              </TableCell>
              <TableCell>
                {record.report?.chiefComplaint || "정보 제공X"}
              </TableCell>
              <TableCell>
                {moment(new Date(record.createOn)).format(
                  "YYYY년 MM월 DD일 HH시 mm분"
                )}
              </TableCell>
              <TableCell className="text-right">
                <ViewReportDialog record={record} />
              </TableCell>
            </TableRow>
          ))}
          {currentHistoryList.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                상담 내역이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {historyList.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            처음
          </Button>
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            이전
          </Button>
          <span className="text-sm font-medium">
            페이지 {currentPage} / {totalPages}
          </span>
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            다음
          </Button>
          <Button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            끝
          </Button>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;

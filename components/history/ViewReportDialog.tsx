import React from "react";
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
import { SessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page";
import moment from "moment";

type ReportItemProps = {
  label: string;
  value?: string | string[] | null | undefined;
  isBoldValue?: boolean;
};

function ReportItem({ label, value, isBoldValue = false }: ReportItemProps) {
  const displayValue = Array.isArray(value) ? value.join(", ") : value;
  const content = displayValue || "정보 제공X";

  return (
    <h2 className="text-[1rem]">
      <span className="font-bold">{label}: </span>
      <span className={isBoldValue ? "font-bold" : ""}>{content}</span>
    </h2>
  );
}

type ReportSectionProps = {
  title: string;
  children: React.ReactNode;
};

function ReportSection({ title, children }: ReportSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="font-bold text-[#09C382] text-lg">{title}</h2>
      <div className="border-b-2 border-[#09C382] pb-2 mb-4"></div>
      <div className="grid grid-cols-1 gap-y-3">{children}</div>
    </div>
  );
}

type Props = {
  record: SessionDetail;
};

function ViewReportDialog({ record }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className="hover:font-bold cursor-pointer transition-all hover:text-[#09C382] hover:no-underline"
        >
          기록 보기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="font-bold text-[#09C382] text-center text-2xl">
              AI의사 상담 내역
            </h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-10">
              <ReportSection title="상담 정보">
                <ReportItem
                  label="AI 의사"
                  value={record.selectedDoctor?.specialist}
                />
                <ReportItem
                  label="상담일"
                  value={moment(new Date(record.createOn)).format(
                    "YYYY년 MM월 DD일 HH시 mm분"
                  )}
                />
              </ReportSection>
              <ReportSection title="언급된 증상">
                <ReportItem label="" value={record.report?.chiefComplaint} />
              </ReportSection>
              <ReportSection title="주요 증상">
                <ReportItem label="" value={record.report?.symptoms} />
              </ReportSection>
              <ReportSection title="답변 요약">
                <ReportItem label="" value={record.report?.summary} />
              </ReportSection>
              <ReportSection title="경과 및 중증도">
                <ReportItem label="경과" value={record.report?.duration} />
                <ReportItem label="중증도" value={record.report?.severity} />
              </ReportSection>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;

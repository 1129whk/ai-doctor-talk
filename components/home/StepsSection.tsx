import Image from "next/image";
import React from "react";

interface StepProps {
  stepNumber: string;
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
  imageWidth: number;
  imageHeight: number;
  imageOnLeft?: boolean;
}

const StepItem: React.FC<StepProps> = ({
  stepNumber,
  title,
  description,
  imageSrc,
  altText,
  imageWidth,
  imageHeight,
  imageOnLeft = false,
}) => {
  return (
    <div className="grid md:grid-cols-2 items-center gap-16 md:gap-24 mb-20">
      <div
        className={`flex flex-col text-center md:text-left ${
          imageOnLeft ? "md:order-2" : "md:order-1"
        }`}
      >
        <p className="text-5xl font-bold text-gray-300 dark:text-gray-700 sm:text-6xl md:text-7xl mb-4">
          {stepNumber}
        </p>
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 sm:text-3xl md:text-4xl lg:text-5xl mb-4">
          {title}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 sm:text-xl md:text-2xl leading-relaxed">
          {description}
        </p>
      </div>
      <div
        className={`flex justify-center ${
          imageOnLeft
            ? "md:justify-start md:order-1"
            : "md:justify-end md:order-2"
        }`}
      >
        <Image
          src={imageSrc}
          className="w-full max-w-md rounded-xl shadow-lg"
          alt={altText}
          width={imageWidth}
          height={imageHeight}
        />
      </div>
    </div>
  );
};

const Steps = () => {
  return (
    <section className="py-20 px-4 w-full max-w-7xl mx-auto">
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 sm:text-xl md:text-5xl lg:text-6xl">
          집에서 간편하게 상담 받으세요.
        </h2>
      </div>
      <StepItem
        stepNumber="01"
        title="분야별로 AI의사를 만나 보세요."
        description="각 분야 별로 전문적인 AI의사가 24시간 상담을 제공합니다."
        imageSrc="/image/steps/step1.png"
        altText="AI의사 목록"
        imageWidth={600}
        imageHeight={500}
        imageOnLeft={false}
      />
      <StepItem
        stepNumber="02"
        title="어떤 AI의사를 만나야 할지 모르겠다면?"
        description="증상이나 기타 정보를 말씀해 주시면 알맞은 분야의 AI의사를 추천해 드립니다."
        imageSrc="/image/steps/step2.png"
        altText="AI의사 목록"
        imageWidth={600}
        imageHeight={500}
        imageOnLeft={true}
      />
      <StepItem
        stepNumber="03"
        title="추천받은 AI의사 중 1명을 선택하세요."
        description="AI의사와 통화를 할 수 있습니다."
        imageSrc="/image/steps/step3.png"
        altText="AI의사 목록"
        imageWidth={600}
        imageHeight={500}
        imageOnLeft={false}
      />
      <StepItem
        stepNumber="04"
        title="AI의사와 통화로 상담해 보세요."
        description="언제부터 어떤 증상을 겪었는지 구체적으로 설명하시면, AI의사가 답변을 제시해 드립니다."
        imageSrc="/image/steps/step4.png"
        altText="AI의사 목록"
        imageWidth={600}
        imageHeight={500}
        imageOnLeft={true}
      />
      <StepItem
        stepNumber="05"
        title="AI의사의 보고서를 받아 보세요."
        description="말씀하신 증상에 대한 치료법, 경과, 중증도를 포함하는 AI의사의 답변이 기재된 보고서를 확인하실 수 있습니다."
        imageSrc="/image/steps/step5.png"
        altText="AI의사 목록"
        imageWidth={600}
        imageHeight={500}
        imageOnLeft={false}
      />
    </section>
  );
};

export default Steps;

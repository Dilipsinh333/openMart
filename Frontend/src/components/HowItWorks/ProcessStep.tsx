import type { LucideIcon } from "lucide-react";

type ProcessStepProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  reverse?: boolean;
};

const ProcessStep = ({
  title,
  description,
  icon: Icon,
  reverse,
}: ProcessStepProps) => {
  return (
    <div className="relative mb-16">
      <div
        className={`md:flex items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="md:w-1/2 pr-8 md:text-right mb-8 md:mb-0">
          <h3 className="text-2xl font-bold text-emerald-600 mb-3">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="md:w-1/2 md:pl-8 flex md:justify-start justify-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-md">
            <Icon className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;

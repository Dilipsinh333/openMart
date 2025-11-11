import type { LucideIcon } from "lucide-react";

type QualityCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const QualityCard = ({ icon: Icon, title, description }: QualityCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-emerald-600" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default QualityCard;

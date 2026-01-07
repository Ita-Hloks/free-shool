import { useNavigate } from "react-router-dom";
import { BackIcon, CloseIcon } from "../icon.tsx";

interface ChildProps {
  title?: string;
}

export default function Head({ title }: ChildProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex items-center border-b border-gray-200 bg-white relative h-14">
      <div className="flex items-center gap-2 pl-2">
        <button type="button" className="rounded p-1" onClick={() => navigate(-1)}>
          <BackIcon className="w-7 h-7 text-gray-600" />
        </button>
        <button type="button" className="rounded p-1">
          <CloseIcon className="w-7 h-7 text-gray-600" />
        </button>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
        {title}
      </div>
    </div>
  );
}

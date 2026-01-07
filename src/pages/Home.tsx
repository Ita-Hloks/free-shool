import { Link } from "react-router-dom";
import Head from "../components/Head.tsx";
import { BagBriefcaseIcon, CircleStandIcon } from "../icon.tsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3f7ff]">
      <Head title="请假" />
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 flex items-center gap-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 12px))" }}
      >
        {/* 我要请假 */}
        <Link
          className="flex-1 flex flex-col items-center justify-center py-1 transition-colors"
          onClick={() => {
          }}
          to="/launchLeaveApplication"
        >
          <BagBriefcaseIcon className="w-6 h-6" />
          <span className="text-xs font-medium text-gray-500">我要请假</span>
        </Link>

        {/* 请假记录 */}
        <button
          type="button"
          className="flex-1 flex flex-col items-center justify-center py-1 transition-colors text-[#0f5ef7]"
        >
          <CircleStandIcon className="w-6 h-6" />
          <span className="text-xs font-medium">请假记录</span>
        </button>
      </div>
    </div>
  );
}

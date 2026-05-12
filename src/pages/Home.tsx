import type { LeaveNote } from "../components/type/leaveApplicationProp.ts";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Head from "../components/common/Head.tsx";
import { BagBriefcaseIcon, CircleStandIcon } from "../icon.tsx";
import { getLeaveNotes } from "../utils/leaveStorage.ts";

export default function Home() {
  const [leaveNotes, setLeaveNotes] = useState<LeaveNote[]>([]);

  // 加载请假记录
  useEffect(() => {
    const loadNotes = () => {
      const notes = getLeaveNotes();
      // 按提交时间降序排列
      const sortedNotes = notes.sort((a: LeaveNote, b: LeaveNote) => {
        return new Date(b.submitTime || b.createdAt).getTime() - new Date(a.submitTime || a.createdAt).getTime();
      });
      setLeaveNotes(sortedNotes);
    };

    loadNotes();
  }, []);

  // 格式化时间显示
  const formatDate = (dateStr: string) => {
    if (!dateStr) {
      return "";
    }
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-[#f3f7ff] pb-16">
      <Head title="请假" />
      {/* 请假记录列表 */}
      <div className="p-4 space-y-3">
        {leaveNotes.length === 0
          ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">暂无请假记录</p>
                <p className="text-gray-400 text-xs mt-2">点击下方"我要请假"发起申请</p>
              </div>
            )
          : (
              leaveNotes.map(note => (
                <Link
                  key={note.id}
                  to={`/leaveDetail/${note.id}`}
                  className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* 头部：类型和状态 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-gray-900">{note.leaveType}</span>
                      <span className="text-xs text-gray-500">·</span>
                      <span className="text-xs text-gray-500">{note.duration || "未计算"}</span>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded text-green-400"
                    >
                      已完成
                    </span>
                  </div>

                  {/* 学生信息 */}
                  <div className="mb-2">
                    <p className="text-sm text-gray-700">
                      <span className="text-gray-500">学生：</span>
                      {note.studentName}
                    </p>
                  </div>

                  {/* 时间信息 */}
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>
                      <span className="inline-block w-14">开始：</span>
                      {formatDate(note.startTime)}
                    </p>
                    <p>
                      <span className="inline-block w-14">结束：</span>
                      {formatDate(note.endTime)}
                    </p>
                  </div>

                  {/* 请假原因预览 */}
                  {note.reason && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {note.reason}
                      </p>
                    </div>
                  )}

                  {/* 提交时间 */}
                  <div className="mt-3 text-xs text-gray-400 text-right">
                    提交于
                    {" "}
                    {formatDate(note.submitTime || note.createdAt)}
                  </div>
                </Link>
              ))
            )}
      </div>

      {/* 底部菜单 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 flex items-center gap-3"
        // style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 12px))" }}
      >
        {/* 我要请假 */}
        <Link
          className="flex-1 flex flex-col items-center justify-center py-1"
          to="/launchLeaveApplication"
        >
          <BagBriefcaseIcon className="w-6 h-6" />
          <span className="text-xs font-medium text-gray-500">我要请假</span>
        </Link>

        {/* 请假记录 */}
        <button
          type="button"
          className="flex-1 flex flex-col items-center justify-center py-1 text-[#0f5ef7]"
        >
          <CircleStandIcon className="w-6 h-6" />
          <span className="text-xs font-medium">请假记录</span>
        </button>
      </div>
    </div>
  );
}

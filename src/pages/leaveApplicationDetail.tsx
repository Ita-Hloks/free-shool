import type { LeaveNote } from "../components/type/leaveApplicationProp.ts";
import { useNavigate, useParams } from "react-router-dom";
import Head from "../components/common/Head.tsx";
import { MenuIcon } from "../icon.tsx";
import Avatar from "../components/common/Avatar.tsx";
import { getLeaveNotes, removeLeaveNoteById } from "../utils/leaveStorage.ts";

export default function LeaveApplicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 从 localStorage 获取请假记录
  const leaveNotes: LeaveNote[] = getLeaveNotes();
  const leaveNote = leaveNotes.find(note => note.id === id);

  if (!leaveNote) {
    return (
      <div className="min-h-screen bg-[#f3f7ff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">请假记录不存在</p>
        </div>
      </div>
    );
  }

  const handleRemove = () => {
    removeLeaveNoteById(leaveNote.id);
    navigate("/");
  };

  const handleEdit = () => {
    navigate("/launchLeaveApplication", { state: { editId: leaveNote.id } });
  };

  const {
    studentName,
    leaveType,
    startTime,
    endTime,
    duration,
    reason,
    attachments,
    location,
    leaveSchool,
    signature,
    submitTime,
    college,
    teacher,
    agreeTime,
  } = leaveNote;

  return (
    <div
      className="min-h-screen bg-[#f3f7ff] text-gray-900 pb-20"
      style={{ paddingTop: "env(safe-area-inset-top, 16px)", paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 60px)" }}
    >
      <Head title="请假详细"></Head>

      {/* 基本信息 */}
      <section className="relative bg-white overflow-hidden mb-3">
        <div className="absolute -left-0 top-4 w-4">
          <div className="text-[10px] leading-3 p-0.5 gap-0 bg-[#e7effe] text-[#0f5ef7] rounded-tr-lg rounded-br-lg">
            请假规则
          </div>
        </div>

        <div className="flex items-center gap-4 p-5 pl-8">
          <div className="flex-shrink-0">
            <Avatar alt="头像" className="w-12 h-12 rounded-full" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-semibold text-[#333333]">
                {studentName}
                的
                {leaveType}
              </h1>
              <span
                className="text-xs font-semibold text-[#3dd4a7] ml-2 max-w-[45%] truncate"
                onClick={handleRemove}
              >
                已通过
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 请假内容 */}
      <section className="bg-white p-5 pt-3 mb-3">
        <h2 className="text-base font-semibold mb-3">请假内容</h2>

        <div className="grid grid-cols-3 gap-y-4 text-xs">
          <div className="text-gray-400">请假学生</div>
          <div className="col-span-2 text-[#0f5ef7]">{studentName}</div>

          <div className="text-gray-400">开始时间</div>
          <div className="col-span-2">{startTime.replace("T", " ")}</div>

          <div className="text-gray-400">结束时间</div>
          <div className="col-span-2">{endTime.replace("T", " ")}</div>

          <div className="text-gray-400">请假时长</div>
          <div className="col-span-2">{duration}</div>

          <div className="text-gray-400">影响课程</div>
          <div className="col-span-2">无</div>

          <div className="text-gray-400">请假原因</div>
          <div className="col-span-2">{reason}</div>

          <div className="text-gray-400">证明材料</div>
          <div className="col-span-2 flex flex-wrap gap-2">
            {attachments && attachments.length > 0
              ? (
                  attachments.map((att, idx) => (
                    <div key={att} className="w-16 h-16 overflow-hidden bg-white m-2 mt-0">
                      <img src={att} alt={`attachment-${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                )
              : (
                  <div className="col-span-2 m-2 mt-0">—</div>
                )}
          </div>

          <div className="text-gray-400">发起位置</div>
          <div className="col-span-2 text-blue-600">{location || "--"}</div>
        </div>
      </section>

      {/* 请假去向 */}
      <section className="bg-white p-5 pt-3 mb-3">
        <h3 className="text-base font-semibold mb-3">请假去向</h3>
        <div className="grid grid-cols-3 gap-y-3 text-xs">
          <div className="text-gray-400">是否离校</div>
          <div className="col-span-2">{leaveSchool}</div>
        </div>
      </section>

      {/* 承诺书手写签名 */}
      <section className="bg-white pt-3 p-5 mb-3">
        <div className="text-base font-semibold mb-3">承诺书手写签名</div>
        <div className="col-span-2 flex gap-2">
          {signature
            ? (
                <div className="w-16 h-16 overflow-hidden">
                  <img src={signature} alt="signature" className="w-full h-full object-contain bg-white" />
                </div>
              )
            : (
                <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
                  <div className="col-span-2 m-2 mt-0">—</div>
                </div>
              )}
        </div>
      </section>

      {/* 审批流程 */}
      <section className="bg-white pt-3 p-5">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">审批流程</h2>
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* 流程列表 */}
        <div className="relative">
          {/* 发起申请 */}
          <div className="flex items-start relative">
            {/* 左侧时间轴 */}
            <div className="flex flex-col items-center mr-4">
              <div className="w-4 h-4 bg-gray-400 rounded-full flex-shrink-0"></div>
              <div className="w-px h-24 mt-1 border-l-2 border-dashed border-gray-300"></div>
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-3">发起申请</h3>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start flex-1 min-w-0">
                  <Avatar alt="avatar" className="w-12 h-12 rounded-full mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 mb-0.5">{studentName}</p>
                    <p className="text-xs whitespace-nowrap text-gray-500">{college}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">{submitTime.replace("T", " ")}</p>
              </div>
            </div>
          </div>

          {/* 审批人 */}
          <div className="flex items-start">
            {/* 左侧时间轴 */}
            <div className="flex flex-col items-center mr-4">
              <div className="w-4 h-4 bg-[#28d093] rounded-full flex-shrink-0"></div>
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-3">审批人</h3>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start flex-1 min-w-0">
                  <div className="relative mr-3 flex-shrink-0">
                    <Avatar alt="avatar" className="w-12 h-12 rounded-full" />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#28d093] text-white text-xs px-2 rounded-full whitespace-nowrap">
                      已同意
                    </span>
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-sm text-gray-900 mb-0.5 font-bold">{teacher}</p>
                    <p className="text-xs whitespace-nowrap text-gray-500">
                      {college}
                      {" "}
                      - 辅导员
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">{agreeTime.replace("T", " ")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部菜单 - 新增部分 */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 12px) + 6px)" }}
      >
        <div className="flex flex-col items-center">
          <button type="button" onClick={handleEdit}>
            <MenuIcon className="w-4 h-4" />
          </button>
          <span className="text-xs">更多</span>
        </div>
        <button
          type="button"
          className="flex-2 py-1.5 text-center text-ms font-medium text-red-400 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          撤销请假申请
        </button>
        {/* <button */}
        {/*    type="button" */}
        {/*    className="flex-1 py-1.5 text-center text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" */}
        {/* > */}
        {/*    续假 */}
        {/* </button> */}
        {/* <button */}
        {/*    type="button" */}
        {/*    className="flex-1 py-1.5 text-center text-base font-medium text-white bg-[#0f5ef7] rounded-lg hover:bg-[#0d4fd4] transition-colors" */}
        {/* > */}
        {/*    销假 */}
        {/* </button> */}
      </div>
    </div>
  );
}

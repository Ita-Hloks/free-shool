import type { LeaveNote } from "../components/type/leaveApplicationProp.ts";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Head from "../components/common/Head.tsx";
import SignaturePad from "../components/common/SignaturePad.tsx";

export default function LaunchLeaveApplication() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LeaveNote>({
    id: "",
    studentName: "",
    leaveType: "病假",
    startTime: "",
    endTime: "",
    duration: "",
    reason: "",
    leaveSchool: "否",
    location: "中国安徽省",
    attachments: [],
    signature: "",
    submitTime: "",
    createdAt: "",
    agreeTime: "",
    college: "",
    teacher: "",
  });

  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动计算请假时长
  useEffect(() => {
    if (form.startTime && form.endTime) {
      const start = new Date(form.startTime);
      const end = new Date(form.endTime);
      const diff = end.getTime() - start.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        let durationStr = "";
        if (days > 0) {
          durationStr += `${days}天`;
        }
        if (hours > 0) {
          durationStr += `${hours}小时`;
        }
        if (minutes > 0 && days === 0) {
          durationStr += `${minutes}分钟`;
        }

        setForm(prev => ({ ...prev, duration: durationStr || "0分钟" }));
      }
    }
  }, [form.startTime, form.endTime]);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newAttachments.push(event.target.result as string);
            if (newAttachments.length === files.length) {
              setForm(prev => ({
                ...prev,
                attachments: [...(prev.attachments || []), ...newAttachments],
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 处理签名保存
  const handleSaveSignature = (signatureData: string) => {
    setForm(prev => ({ ...prev, signature: signatureData }));
    setIsSignatureOpen(false);
  };

  // 返回处理
  const onBack = () => {
    navigate("/");
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 生成 ID 和时间戳
    const now = new Date().toISOString();
    const newNote: LeaveNote = {
      ...form,
      id: `leave_${Date.now()}`,
      createdAt: now,
      submitTime: form.submitTime || now,
    };

    // 保存到 localStorage
    const existingNotes = JSON.parse(localStorage.getItem("leaveNotes") || "[]");
    existingNotes.push(newNote);
    localStorage.setItem("leaveNotes", JSON.stringify(existingNotes));

    // 跳转到详情页
    navigate(`/leaveDetail/${newNote.id}`);
  };

  return (
    <div className="min-h-screen">
      <Head title="请假申请" />
      <form className="p-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs text-gray-500">学生姓名</label>
          <input
            value={form.studentName}
            onChange={e => setForm({ ...form, studentName: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">请假类型</label>
          <select
            value={form.leaveType}
            onChange={e => setForm({ ...form, leaveType: e.target.value as "病假" | "事假" | "其他" })}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="病假">病假</option>
            <option value="事假">事假</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500">开始时间</label>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={e => setForm({ ...form, startTime: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">结束时间</label>
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={e => setForm({ ...form, endTime: e.target.value })}
            min={form.startTime}
            className="w-full mt-1 p-2 border rounded"
            required
            disabled={!form.startTime}
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">请假时长自动计算：</label>
          <div className="w-full mt-1 p-2">
            {form.duration}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500">请假原因</label>
          <textarea
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
            className="w-full mt-1 p-2 border rounded min-h-[80px]"
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">是否离校</label>
          <select
            value={form.leaveSchool}
            onChange={e => setForm({ ...form, leaveSchool: e.target.value as "是" | "否" })}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">发起位置</label>
          <input
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">证明材料</label>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mt-1 p-2 border rounded"
          />
          {form.attachments && form.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.attachments.map((url, index) => (
                <div key={form.id} className="relative">
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, attachments: prev.attachments?.filter((_, i) => i !== index) || [] }))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500">签名</label>
          <button
            type="button"
            onClick={() => setIsSignatureOpen(true)}
            className="w-full mt-1 p-2 border rounded text-left"
          >
            {form.signature ? "重新签名" : "点击签名"}
          </button>
          {form.signature && (
            <img src={form.signature} alt="签名" className="mt-2 h-20 border rounded" />
          )}
        </div>

        <SignaturePad
          isOpen={isSignatureOpen}
          onSave={handleSaveSignature}
          onClose={() => setIsSignatureOpen(false)}
        />

        <div className="border-b-2 p-2">从这一行开始，填入必要性可有可无，因为截图截不到了</div>
        <div>
          <label className="text-xs text-gray-500">发起申请时间</label>
          <input
            type="datetime-local"
            value={form.submitTime}
            onChange={e => setForm({ ...form, submitTime: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">辅导员审核通过时间</label>
          <input
            type="datetime-local"
            value={form.agreeTime}
            onChange={e => setForm({ ...form, agreeTime: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">辅导员姓名</label>
          <input
            type="text"
            value={form.teacher}
            onChange={e => setForm({ ...form, teacher: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">所处的二级学院</label>
          <input
            type="text"
            value={form.college}
            onChange={e => setForm({ ...form, college: e.target.value })}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={onBack} className="flex-1 p-2 border rounded bg-white">取消</button>
          <button type="submit" className="flex-1 p-2 rounded bg-[#0f5ef7] text-white">提交</button>
        </div>
      </form>
    </div>
  );
}

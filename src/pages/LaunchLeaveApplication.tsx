import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Head from "../components/common/Head.tsx";
import SignaturePad from "../components/common/SignaturePad.tsx";
import { useLeaveApplicationForm } from "../hooks/useLeaveApplicationForm.ts";
import { compressImageFile, estimateDataUrlBytes } from "../utils/imageCompress.ts";
import { getHistoryValues, getLeaveNoteById, saveLeaveNote, updateLeaveNote } from "../utils/leaveStorage.ts";

export default function LaunchLeaveApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    form,
    setForm,
    isSignatureOpen,
    setIsSignatureOpen,
    buildLeaveNoteForSubmit,
    addAttachments,
    removeAttachment,
    handleSaveSignature,
  } = useLeaveApplicationForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameHistory, setNameHistory] = useState<string[]>([]);
  const [locationHistory, setLocationHistory] = useState<string[]>([]);
  const [showNameHistory, setShowNameHistory] = useState(false);
  const [showLocationHistory, setShowLocationHistory] = useState(false);
  const editId = (location.state as { editId?: string } | null)?.editId;

  useEffect(() => {
    setNameHistory(getHistoryValues("studentName"));
    setLocationHistory(getHistoryValues("location"));
  }, []);

  useEffect(() => {
    if (!editId) {
      return;
    }
    const note = getLeaveNoteById(editId);
    if (note) {
      setForm(note);
    }
  }, [editId, setForm]);

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    const MAX_TOTAL_BYTES = 3_000_000;
    const errors: string[] = [];
    const newAttachments: string[] = [];
    const existingBytes = (form.attachments || []).reduce(
      (sum, item) => sum + estimateDataUrlBytes(item),
      0,
    );
    let totalBytes = existingBytes;

    for (const file of files) {
      try {
        const { dataUrl, byteSize } = await compressImageFile(file);
        if (totalBytes + byteSize > MAX_TOTAL_BYTES) {
          throw new Error("附件总大小超过上限，请减少图片数量");
        }
        newAttachments.push(dataUrl);
        totalBytes += byteSize;
      } catch (error) {
        const message = error instanceof Error ? error.message : "图片处理失败";
        errors.push(`${file.name}：${message}`);
      }
    }

    if (errors.length > 0) {
      alert(`部分图片未添加：\n${errors.join("\n")}`);
    }
    if (newAttachments.length > 0) {
      addAttachments(newAttachments);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 返回处理
  const onBack = () => {
    navigate("/");
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      const now = new Date().toISOString();
      const updatedNote = {
        ...form,
        id: editId,
        createdAt: form.createdAt || now,
        submitTime: form.submitTime || now,
      };
      updateLeaveNote(updatedNote);
      navigate(`/leaveDetail/${editId}`);
      return;
    }
    const newNote = buildLeaveNoteForSubmit();
    saveLeaveNote(newNote);
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
            onFocus={() => setShowNameHistory(true)}
            onBlur={() => setShowNameHistory(false)}
            list="studentNameHistory"
            className="w-full mt-1 p-2 border rounded"
            required
          />
          {showNameHistory && nameHistory.length > 0 && (
            <datalist id="studentNameHistory">
              {nameHistory.map(name => (
                <option key={name} value={name} />
              ))}
            </datalist>
          )}
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
            onFocus={() => setShowLocationHistory(true)}
            onBlur={() => setShowLocationHistory(false)}
            list="locationHistory"
            className="w-full mt-1 p-2 border rounded"
          />
          {showLocationHistory && locationHistory.length > 0 && (
            <datalist id="locationHistory">
              {locationHistory.map(location => (
                <option key={location} value={location} />
              ))}
            </datalist>
          )}
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
                <div key={`${url}-${index}`} className="relative">
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
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

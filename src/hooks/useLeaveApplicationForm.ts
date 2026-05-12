import { useCallback, useEffect, useState } from "react";
import type { LeaveNote } from "../components/type/leaveApplicationProp.ts";

const buildInitialForm = (): LeaveNote => ({
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

export const useLeaveApplicationForm = () => {
  const [form, setForm] = useState<LeaveNote>(buildInitialForm());
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);

  useEffect(() => {
    if (!form.startTime || !form.endTime) {
      return;
    }

    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    const diff = end.getTime() - start.getTime();

    if (diff <= 0) {
      return;
    }

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
  }, [form.startTime, form.endTime]);

  const buildLeaveNoteForSubmit = useCallback((): LeaveNote => {
    const now = new Date().toISOString();
    return {
      ...form,
      id: `leave_${Date.now()}`,
      createdAt: now,
      submitTime: form.submitTime || now,
    };
  }, [form]);

  const addAttachments = useCallback((attachments: string[]) => {
    if (attachments.length === 0) {
      return;
    }
    setForm(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...attachments],
    }));
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setForm(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  const handleSaveSignature = useCallback((signatureData: string) => {
    setForm(prev => ({ ...prev, signature: signatureData }));
    setIsSignatureOpen(false);
  }, []);

  return {
    form,
    setForm,
    isSignatureOpen,
    setIsSignatureOpen,
    buildLeaveNoteForSubmit,
    addAttachments,
    removeAttachment,
    handleSaveSignature,
  };
};

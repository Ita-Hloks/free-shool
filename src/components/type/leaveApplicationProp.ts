export interface LeaveNote {
  id: string;
  studentName: string;
  leaveType: "病假" | "事假" | "其他";
  startTime: string;
  endTime: string;
  duration: string;
  reason: string;
  leaveSchool: "是" | "否";
  location: string;
  attachments?: string[];
  signature?: string;
  submitTime: string;
  createdAt: string;
  agreeTime: string;
  college: string;
  teacher: string;
}

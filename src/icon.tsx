import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

/* 关键词：返回 */
export function BackIcon(props: IconProps) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/* 关键词：关闭 */
export function CloseIcon(props: IconProps) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

/* 关键词：菜单 更多 */
export function MenuIcon(props: IconProps) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      stroke-width="3"
      className="lucide lucide-text-align-justify-icon lucide-text-align-justify"
      {...rest}
    >
      <path d="M3 5h18" />
      <path d="M6 12h12" />
      <path d="M10 19h4" />
    </svg>
  );
}

/* 关键词：行李箱 */
export function BagBriefcaseIcon(props: IconProps) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      {...rest}
    >
      <rect x="8" y="2.5" width="8" height="4" rx="0" />
      {/* 箱体 */}
      <rect x="3" y="6" width="18" height="15" rx="0" />
      {/* 左侧线 */}
      <line x1="3" y1="13.5" x2="9.5" y2="13.5" />
      {/* 右侧线 */}
      <line x1="14.5" y1="13.5" x2="21" y2="13.5" />
      <rect x="10" y="11" width="4" height="6" />
    </svg>
  );
}

/* 关键词：记录 列表 文档 */
export function CircleStandIcon(props: IconProps) {
  const { strokeWidth = 1.5, ...rest } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {/* 圆 */}
      <circle cx="12" cy="8.5" r="6" />
      {/* 短竖线 */}
      <line x1="12" y1="14.5" x2="12" y2="16.5" />
      {/* 底座 */}
      <line x1="6" y1="19" x2="18" y2="19" />
    </svg>
  );
}

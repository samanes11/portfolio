/**
 * CustomTags.tsx
 *
 * این فایل تگ‌های custom فریمورک QE رو به کامپوننت‌های استاندارد React تبدیل می‌کنه.
 *
 * نامگذاری:
 *  c-cc  → flex col, items-center, justify-center
 *  c-ss  → flex col, items-start, justify-start
 *  c-xs  → flex col, items-start (no justify)  -- scroll container
 *  f-x   → flex row
 *  f-xs  → flex row, items-start
 *  f-xse → flex row, items-start, justify-between  -- (space-between)
 *  f-cs  → flex row, items-center, justify-start
 *  f-cse → flex row, items-center, justify-start + gap
 *  f-csb → flex row, items-center, justify-between
 *  w-ss  → flex col (width 100%)
 *  w-cs  → flex row, items-center (width related)
 *  w-csb → flex row, items-center, justify-between (width related)
 *  w-cc  → flex col, items-center, justify-center (width related)
 *  w-cse → flex row, items-center (width flex)
 *  sp-3  → inline spacer 3px
 *  sp-xxxx → inline spacer 4px
 *  f-N   → span با font-size N px  (f-10 تا f-32)
 *  br-x  → div با height 1px (line break / divider)
 *  icon  → <span> که iconify class رو render می‌کنه
 */

import React, { HTMLAttributes } from "react";

// ─── Flex helpers ───────────────────────────────────────────────────────────

type DivProps = HTMLAttributes<HTMLDivElement>;
type SpanProps = HTMLAttributes<HTMLSpanElement>;

/** flex col • center center */
export const Ccc = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-col items-center justify-center ${className}`} {...p} />
);

/** flex col • start start */
export const Css = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-col items-start justify-start ${className}`} {...p} />
);

/** flex col • start (scroll container) */
export const Cxs = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-col items-start overflow-y-auto ${className}`} {...p} />
);

/** flex row */
export const Fx = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row ${className}`} {...p} />
);

/** flex row • start */
export const Fxs = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-start ${className}`} {...p} />
);

/** flex row • start space-between */
export const Fxse = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-start justify-between ${className}`} {...p} />
);

/** flex row • center start */
export const Fcs = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-center justify-start ${className}`} {...p} />
);

/** flex row • center start (same as Fcs, alias used in codebase) */
export const Fcse = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-center gap-2 ${className}`} {...p} />
);

/** flex row • center space-between */
export const Fcsb = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-center justify-between ${className}`} {...p} />
);

/** width-full flex col */
export const Wss = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-col w-full ${className}`} {...p} />
);

/** width flex row • center start */
export const Wcs = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-center ${className}`} {...p} />
);

/** width flex row • center space-between */
export const Wcsb = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-center justify-between w-full ${className}`} {...p} />
);

/** width flex col • center center */
export const Wcc = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-col items-center justify-center w-full ${className}`} {...p} />
);

/** width flex row • center */
export const Wcse = ({ className = "", ...p }: DivProps) => (
  <div className={`flex flex-row items-center w-full ${className}`} {...p} />
);

// ─── Spacers ────────────────────────────────────────────────────────────────

export const Sp3 = () => <span style={{ display: "inline-block", width: 3 }} />;
export const Spxxxx = () => <span style={{ display: "inline-block", width: 4 }} />;

// ─── Typography spans ────────────────────────────────────────────────────────

const mkFont = (size: number) =>
  ({ className = "", style, ...p }: SpanProps) => (
    <span
      className={`leading-tight ${className}`}
      style={{ fontSize: size, ...style }}
      {...p}
    />
  );

export const F10 = mkFont(10);
export const F11 = mkFont(11);
export const F12 = mkFont(12);
export const F13 = mkFont(13);
export const F14 = mkFont(14);
export const F15 = mkFont(15);
export const F16 = mkFont(16);
export const F17 = mkFont(17);
export const F18 = mkFont(18);
export const F19 = mkFont(19);
export const F20 = mkFont(20);
export const F32 = mkFont(32);

// ─── Icon ────────────────────────────────────────────────────────────────────

/**
 * <Icon cls="w-5 h-5 icon-[mdi--home]" />
 * معادل:  <icon class="w-5 h-5 icon-[mdi--home]" />
 */
export const Icon = ({
  cls,
  className,
  style,
}: {
  cls?: string;
  className?: string;
  style?: React.CSSProperties;
}) => <span className={cls ?? className ?? ""} style={style} />;

// ─── Misc ────────────────────────────────────────────────────────────────────

/** خط جداکننده / فاصله عمودی */
export const BrX = ({ className = "" }: { className?: string }) => (
  <div className={`h-px w-full ${className}`} />
);

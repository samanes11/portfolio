"use client";

import WindowFloat from "../ui/WindowFloat";

interface AboutWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

const skills = [
  { name: "frontendSkills", items: ["HTML", "CSS", "JavaScript", "React.js", "Next.js", "Tailwind CSS"] },
  { name: "backendSkills",  items: ["Node.js", "Express.js", "Python", "Django", "C#", "C++"] },
  { name: "databaseSkills", items: ["MongoDB", "PostgreSQL", "Firebase", "MySQL", "Redis"] },
  { name: "mobileSkills",   items: ["Flutter", "Dart", "React Native"] },
  { name: "tools",          items: ["Git", "VS Code", "Figma", "Docker"] },
];

const bioLines = [
  "Hi! I'm Saman Esmaellpour, a full-stack developer and a member of the Turing group,",
  "specializing in React.js, Next.js, JavaScript, Node.js, Python, C#, and C++.",
  "Combining deep technical knowledge with a passion for problem-solving, I've worked",
  "on diverse projects ranging from cloud-based services to real-time applications.",
  "I'm committed to delivering clean, maintainable, and scalable code while helping",
  "businesses innovate and grow.",
];

// VS Code token colors
const C = {
  keyword:    "#C586C0", // purple - const, export, return
  fn:         "#DCDCAA", // yellow - function names
  param:      "#9CDCFE", // light blue - params, props
  str:        "#CE9178", // orange - strings
  tag:        "#4EC9B0", // teal - JSX tags
  attr:       "#9CDCFE", // light blue - JSX attributes
  punc:       "#808080", // gray - brackets, punctuation
  plain:      "#D4D4D4", // light gray - default text
  comment:    "#6A9955", // green - comments
  operator:   "#D4D4D4", // = signs
  lineNum:    "#3E4351", // line numbers
  activeLine: "#282828", // active line highlight
};

type Span = { t: string; c: string; italic?: boolean };

const Line = ({ tokens, indent = 0 }: { tokens: Span[]; indent?: number }) => (
  <div style={{ display: "flex", paddingLeft: indent * 14, minHeight: 20 }}>
    {tokens.map((s, i) => (
      <span
        key={i}
        style={{
          color: s.c,
          fontStyle: s.italic ? "italic" : undefined,
          whiteSpace: "pre",
          fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
          fontSize: 13,
          lineHeight: "20px",
        }}
      >
        {s.t}
      </span>
    ))}
  </div>
);

const Blank = () => <div style={{ minHeight: 20 }} />;

export default function AboutWindow({ onClose, onMinimize }: AboutWindowProps) {
  // Build line data
  const codeLines: Array<{ tokens: Span[]; indent?: number } | "blank"> = [
    // import statement
    {
      tokens: [
        { t: "import ", c: C.keyword },
        { t: "React", c: C.plain },
        { t: " from ", c: C.keyword },
        { t: '"react"', c: C.str },
        { t: ";", c: C.punc },
      ],
    },
    "blank",
    // comment
    {
      tokens: [
        { t: "// Portfolio · Saman Esmaellpour", c: C.comment, italic: true },
      ],
    },
    "blank",
    // export const AboutMe
    {
      tokens: [
        { t: "export ", c: C.keyword },
        { t: "const ", c: C.keyword },
        { t: "AboutMe", c: C.fn },
        { t: " = ", c: C.operator },
        { t: "()", c: C.punc },
        { t: " => ", c: C.keyword },
        { t: "{", c: C.punc },
      ],
    },
    // return (
    {
      indent: 1,
      tokens: [
        { t: "return ", c: C.keyword },
        { t: "(", c: C.punc },
      ],
    },
    // <div className="...">
    {
      indent: 2,
      tokens: [
        { t: "<", c: C.punc },
        { t: "div ", c: C.tag },
        { t: "className", c: C.attr },
        { t: "=", c: C.operator },
        { t: '"flex flex-col items-center justify-center w-full"', c: C.str },
        { t: ">", c: C.punc },
      ],
    },
    "blank",
    // h1 About Me
    {
      indent: 3,
      tokens: [
        { t: "<", c: C.punc },
        { t: "h1 ", c: C.tag },
        { t: "className", c: C.attr },
        { t: "=", c: C.operator },
        { t: '"text-4xl font-bold text-white font-serif"', c: C.str },
        { t: ">", c: C.punc },
        { t: "About Me", c: C.plain },
        { t: "</", c: C.punc },
        { t: "h1", c: C.tag },
        { t: ">", c: C.punc },
      ],
    },
    "blank",
    // <p className="...">
    {
      indent: 3,
      tokens: [
        { t: "<", c: C.punc },
        { t: "p ", c: C.tag },
        { t: "className", c: C.attr },
        { t: "=", c: C.operator },
        { t: '"text-center mt-4 text-white/60 md:text-lg"', c: C.str },
        { t: ">", c: C.punc },
      ],
    },
    ...bioLines.map((line) => ({
      indent: 4,
      tokens: [{ t: line, c: C.plain }],
    })),
    {
      indent: 3,
      tokens: [
        { t: "</", c: C.punc },
        { t: "p", c: C.tag },
        { t: ">", c: C.punc },
      ],
    },
    "blank",
    // h1 Skills
    {
      indent: 3,
      tokens: [
        { t: "<", c: C.punc },
        { t: "h1 ", c: C.tag },
        { t: "className", c: C.attr },
        { t: "=", c: C.operator },
        { t: '"text-2xl font-bold text-white mt-6"', c: C.str },
        { t: ">", c: C.punc },
        { t: "Skills", c: C.plain },
        { t: "</", c: C.punc },
        { t: "h1", c: C.tag },
        { t: ">", c: C.punc },
      ],
    },
    "blank",
    // skill arrays
    ...skills.map(({ name, items }) => ({
      indent: 3,
      tokens: [
        { t: "const ", c: C.keyword },
        { t: name, c: C.fn },
        { t: " = ", c: C.operator },
        { t: "[", c: C.punc },
        ...items.flatMap((item, ii) => [
          { t: `"${item}"`, c: C.str },
          ...(ii < items.length - 1 ? [{ t: ", ", c: C.punc }] : []),
        ]),
        { t: "]", c: C.punc },
        { t: ";", c: C.punc },
      ],
    })),
    "blank",
    // closing </div>
    {
      indent: 2,
      tokens: [
        { t: "</", c: C.punc },
        { t: "div", c: C.tag },
        { t: ">", c: C.punc },
      ],
    },
    // );
    {
      indent: 1,
      tokens: [
        { t: ")", c: C.punc },
        { t: ";", c: C.punc },
      ],
    },
    // }; export
    {
      tokens: [
        { t: "}", c: C.punc },
        { t: ";", c: C.punc },
      ],
    },
    "blank",
    {
      tokens: [
        { t: "export default ", c: C.keyword },
        { t: "AboutMe", c: C.fn },
        { t: ";", c: C.punc },
      ],
    },
  ];

  const startLineNumber = 1;

  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      showMinimize
      maxWidth="min(92vw, 860px)"
      title="aboutMe.tsx"
      contentStyle={{ background: "#1e1e1e", padding: 0 }}
    >
      <div
        style={{ direction: "ltr", display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* ── Activity Bar (left strip) ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div
            style={{
              width: 44,
              background: "#333333",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 8,
              gap: 4,
              flexShrink: 0,
              borderRight: "1px solid #252526",
            }}
          >
            {[
              { icon: "icon-[codicon--files]", active: true },
              { icon: "icon-[codicon--search]" },
              { icon: "icon-[codicon--source-control]" },
              { icon: "icon-[codicon--extensions]" },
            ].map(({ icon, active }, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeft: active ? "2px solid #ffffff" : "2px solid transparent",
                  opacity: active ? 1 : 0.45,
                  cursor: "pointer",
                }}
              >
                <span
                  className={`${icon} w-[24px] h-[24px]`}
                  style={{ color: "#cccccc" }}
                />
              </div>
            ))}
          </div>

          {/* ── Sidebar (file explorer) ── */}
          <div
            style={{
              width: 200,
              background: "#252526",
              borderRight: "1px solid #1e1e1e",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Explorer header */}
            <div
              style={{
                padding: "10px 12px 6px",
                fontSize: 11,
                fontWeight: 700,
                color: "#bbbbbb",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              Explorer
            </div>

            {/* Open Editors */}
            <div
              style={{
                padding: "4px 12px",
                fontSize: 11,
                color: "#bbbbbb",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 4,
                userSelect: "none",
              }}
            >
              <span className="icon-[codicon--chevron-down] w-[12px] h-[12px]" style={{ color: "#bbbbbb" }} />
              Open Editors
            </div>
            {["index.tsx", "aboutMe.tsx"].map((f, i) => (
              <div
                key={f}
                style={{
                  padding: "3px 12px 3px 28px",
                  fontSize: 12,
                  color: i === 1 ? "#ffffff" : "#8a8a8a",
                  background: i === 1 ? "#37373d" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span className="icon-[catppuccin--typescript-react] w-[14px] h-[14px]" style={{ flexShrink: 0 }} />
                {f}
              </div>
            ))}

            <div style={{ height: 1, background: "#3c3c3c", margin: "6px 0" }} />

            {/* Portfolio folder */}
            <div
              style={{
                padding: "4px 12px",
                fontSize: 11,
                color: "#bbbbbb",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 4,
                userSelect: "none",
              }}
            >
              <span className="icon-[codicon--chevron-down] w-[12px] h-[12px]" style={{ color: "#bbbbbb" }} />
              Portfolio
            </div>
            {[
              { name: "components", type: "folder", indent: 1 },
              { name: "aboutMe.tsx", type: "tsx", indent: 2, active: true },
              { name: "index.tsx", type: "tsx", indent: 2 },
              { name: "windows", type: "folder", indent: 2 },
              { name: "pages", type: "folder", indent: 1 },
              { name: "public", type: "folder", indent: 1 },
              { name: "package.json", type: "json", indent: 1 },
              { name: "tsconfig.json", type: "json", indent: 1 },
            ].map(({ name, type, indent, active }, i) => (
              <div
                key={i}
                style={{
                  padding: "2px 0px 2px",
                  paddingLeft: 12 + indent * 14,
                  fontSize: 12,
                  color: active ? "#ffffff" : "#cccccc",
                  background: active ? "#37373d" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {type === "folder" ? (
                  <span className="icon-[codicon--folder] w-[14px] h-[14px]" style={{ color: "#e8ab53", flexShrink: 0 }} />
                ) : type === "tsx" ? (
                  <span className="icon-[catppuccin--typescript-react] w-[14px] h-[14px]" style={{ flexShrink: 0 }} />
                ) : (
                  <span className="icon-[catppuccin--json] w-[14px] h-[14px]" style={{ flexShrink: 0 }} />
                )}
                <span style={{ fontFamily: "system-ui, sans-serif" }}>{name}</span>
              </div>
            ))}
          </div>

          {/* ── Main Editor Area ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
            {/* Tab Bar */}
            <div
              style={{
                height: 35,
                background: "#252526",
                borderBottom: "1px solid #1e1e1e",
                display: "flex",
                alignItems: "stretch",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* Inactive tab */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 12px",
                  background: "#1e1e1e",
                  borderRight: "1px solid #252526",
                  cursor: "pointer",
                  minWidth: 120,
                  maxWidth: 180,
                }}
              >
                <span className="icon-[catppuccin--typescript-react] w-[14px] h-[14px]" style={{ flexShrink: 0 }} />
                <span style={{ color: "#8a8a8a", fontSize: 13, fontFamily: "system-ui, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  index.tsx
                </span>
              </div>
              {/* Active tab */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 12px",
                  background: "#1e1e1e",
                  borderTop: "2px solid #007acc",
                  borderRight: "1px solid #252526",
                  minWidth: 120,
                  maxWidth: 200,
                  position: "relative",
                }}
              >
                <span className="icon-[catppuccin--typescript-react] w-[14px] h-[14px]" style={{ flexShrink: 0 }} />
                <span style={{ color: "#ffffff", fontSize: 13, fontFamily: "system-ui, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  aboutMe.tsx
                </span>
                <span style={{ color: "#8a8a8a", fontSize: 16, lineHeight: 1, cursor: "pointer", marginLeft: 4, opacity: 0.6 }}>×</span>
              </div>
              <div style={{ flex: 1, background: "#2d2d2d" }} />
            </div>

            {/* Breadcrumb */}
            <div
              style={{
                height: 26,
                background: "#1e1e1e",
                borderBottom: "1px solid #252526",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 4,
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {["frontend", "components", "portfolio"].map((seg) => (
                <span key={seg} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#8a8a8a", fontSize: 12, fontFamily: "system-ui, sans-serif" }}>{seg}</span>
                  <span style={{ color: "#555", fontSize: 12 }}>›</span>
                </span>
              ))}
              <span className="icon-[catppuccin--typescript-react] w-[12px] h-[12px]" />
              <span style={{ color: "#4fc1ff", fontSize: 12, fontFamily: "system-ui, sans-serif" }}>aboutMe.tsx</span>
              <span style={{ color: "#555", fontSize: 12 }}>›</span>
              <span style={{ color: "#dcdcaa", fontSize: 12, fontFamily: "system-ui, sans-serif" }}>AboutMe</span>
            </div>

            {/* Code Editor */}
            <div
              style={{
                flex: 1,
                background: "#1e1e1e",
                overflowY: "auto",
                overflowX: "auto",
                display: "flex",
              }}
            >
              {/* Gutter (line numbers) */}
              <div
                style={{
                  background: "#1e1e1e",
                  borderRight: "1px solid #333",
                  padding: "0 12px 0 8px",
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                {codeLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      minHeight: 20,
                      lineHeight: "20px",
                      color: i === 5 ? "#858585" : C.lineNum,
                      fontSize: 13,
                      textAlign: "right",
                      fontFamily: "'Cascadia Code', 'Consolas', monospace",
                    }}
                  >
                    {line === "blank" ? "\u00a0" : startLineNumber + i}
                  </div>
                ))}
              </div>

              {/* Code content */}
              <div style={{ padding: "0 24px 24px 12px", flex: 1 }}>
                {codeLines.map((line, i) =>
                  line === "blank" ? (
                    <Blank key={i} />
                  ) : (
                    <Line key={i} tokens={line.tokens} indent={line.indent} />
                  )
                )}
              </div>
            </div>

            {/* Status Bar */}
            <div
              style={{
                height: 24,
                background: "#007acc",
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="icon-[codicon--source-control] w-[12px] h-[12px]" style={{ color: "#ffffff", opacity: 0.9 }} />
                  <span style={{ color: "#ffffff", fontSize: 12, fontFamily: "system-ui, sans-serif", opacity: 0.9 }}>main*</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="icon-[codicon--error] w-[12px] h-[12px]" style={{ color: "#ffffff", opacity: 0.9 }} />
                  <span style={{ color: "#ffffff", fontSize: 12, opacity: 0.9 }}>0</span>
                  <span className="icon-[codicon--warning] w-[12px] h-[12px]" style={{ color: "#ffffff", opacity: 0.9, marginLeft: 4 }} />
                  <span style={{ color: "#ffffff", fontSize: 12, opacity: 0.9 }}>0</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {[
                  `Ln ${codeLines.length}, Col 1`,
                  "Spaces: 2",
                  "UTF-8",
                  "CRLF",
                  "TypeScript React",
                  "Prettier",
                ].map((label) => (
                  <span
                    key={label}
                    style={{
                      color: "#ffffff",
                      fontSize: 12,
                      opacity: 0.9,
                      fontFamily: "system-ui, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFloat>
  );
}
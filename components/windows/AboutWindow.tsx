"use client";

import WindowFloat from "../ui/WindowFloat";

interface AboutWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

const Sp3 = () => <span style={{ display: "inline-block", width: 3 }} />;
const Sp4 = () => <span style={{ display: "inline-block", width: 4 }} />;

export default function AboutWindow({ onClose, onMinimize }: AboutWindowProps) {
  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      maxWidth="140vh"
      title="aboutMe.tsx"
      contentStyle={{ background: "#1e1e1e", padding: 0 }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{ direction: "ltr" }}
      >
        {/* Tab Bar */}
        <div className="flex flex-row items-start justify-between bg-[#252526] h-[30px] sm:h-[35px] border-b border-[#2d2d2d] overflow-x-auto flex-shrink-0">
          {/* Inactive tab */}
          <div
            className="flex flex-row items-center bg-[#161616] px-2 sm:px-3 gap-1.5 sm:gap-2.5 border-r border-[#2d2d2d] relative group hover:bg-[#1d1c1c] transition-colors cursor-pointer flex-shrink-0 h-full"
            style={{ minWidth: 100, maxWidth: 200 }}
          >
            <span className="icon-[catppuccin--typescript-react] w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] flex-shrink-0" />
            <span
              className="text-[#969696] font-mono tracking-tight flex-1 truncate"
              style={{ fontSize: 13 }}
            >
              index.tsx
            </span>
          </div>
          {/* Active tab */}
          <div
            className="flex flex-row items-center bg-[#2d2d30] px-2 sm:px-3 gap-1.5 sm:gap-2.5 border-r border-[#2d2d2d] relative group flex-shrink-0 h-full"
            style={{ minWidth: 100, maxWidth: 200 }}
          >
            <span className="icon-[catppuccin--typescript-react] w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] flex-shrink-0" />
            <span
              className="text-[#cccccc] font-mono tracking-tight flex-1 truncate"
              style={{ fontSize: 13 }}
            >
              aboutMe.tsx
            </span>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#007acc]" />
          </div>
          <div className="flex-1 bg-[#252526]" />
        </div>

        {/* Breadcrumb */}
        <div className="flex flex-row items-center bg-[#252526] px-2 sm:px-4 py-1 sm:py-1.5 gap-1 sm:gap-2 border-b border-[#2d2d2d] overflow-x-auto flex-shrink-0">
          {["frontend", "components", "portfolio"].map((seg) => (
            <span key={seg} className="flex items-center gap-1 sm:gap-2">
              <span
                className="text-gray-400 font-mono whitespace-nowrap"
                style={{ fontSize: 11 }}
              >
                {seg}
              </span>
              <span className="text-gray-500" style={{ fontSize: 11 }}>
                &gt;
              </span>
            </span>
          ))}
          <span className="icon-[catppuccin--typescript-react] w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
          <span
            className="text-blue-400 font-mono whitespace-nowrap"
            style={{ fontSize: 11 }}
          >
            aboutMe.tsx
          </span>
          <span className="text-gray-500" style={{ fontSize: 11 }}>
            &gt;
          </span>
          <span className="text-gray-600" style={{ fontSize: 11 }}>
            ...
          </span>
        </div>

        {/* Code Editor */}
        <div
          className="bg-[#1e1e1e] p-2 sm:p-3 font-mono overflow-y-auto overflow-x-auto flex-1"
          style={{ maxHeight: "60vh", fontSize: 11, lineHeight: "16px" }}
        >
          <div className="flex flex-row min-w-max">
            {/* Line numbers */}
            <div
              className="flex flex-col text-gray-600 pr-2 sm:pr-3 select-none text-right flex-shrink-0"
              style={{ minWidth: 30 }}
            >
              {Array.from({ length: 27 }, (_, i) => (
                <span key={i} style={{ fontSize: 12 }}>
                  {i + 3}
                </span>
              ))}
            </div>

            {/* Code */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* export const AboutMe = () => { */}
              <div className="flex flex-row items-center whitespace-nowrap">
                <span className="text-purple-400" style={{ fontSize: 13 }}>
                  export const
                </span>
                <Sp3 />
                <span className="text-yellow-300" style={{ fontSize: 13 }}>
                  AboutMe
                </span>
                <Sp3 />
                <span className="text-white" style={{ fontSize: 13 }}>
                  =
                </span>
                <Sp3 />
                <span className="text-blue-400" style={{ fontSize: 13 }}>
                  ()
                </span>
                <Sp3 />
                <span className="text-purple-400" style={{ fontSize: 13 }}>
                  =&gt;
                </span>
                <Sp3 />
                <span
                  className="text-yellow-300"
                  style={{ fontSize: 13 }}
                >{`{`}</span>
              </div>
              <div className="flex flex-row pl-4 sm:pl-6 whitespace-nowrap">
                <span className="text-purple-400" style={{ fontSize: 13 }}>
                  return
                </span>
                <Sp3 />
                <span className="text-gray-400" style={{ fontSize: 13 }}>
                  (
                </span>
              </div>

              {/* <div className="flex flex-col ..."> */}
              <div className="flex flex-row pl-8 sm:pl-12 whitespace-nowrap">
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  div
                </span>
                <Sp3 />
                <span className="text-blue-300" style={{ fontSize: 13 }}>
                  className
                </span>
                <span className="text-white" style={{ fontSize: 13 }}>
                  =
                </span>
                <span className="text-orange-400" style={{ fontSize: 13 }}>
                  &quot;flex flex-col items-center justify-center w-full&quot;
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
              </div>

              {/* h1 About Me */}
              <div className="flex flex-row pl-12 sm:pl-16 whitespace-nowrap">
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  h1
                </span>
                <Sp3 />
                <span className="text-blue-300" style={{ fontSize: 13 }}>
                  className
                </span>
                <span className="text-white" style={{ fontSize: 13 }}>
                  =
                </span>
                <span className="text-orange-400" style={{ fontSize: 13 }}>
                  &quot;text-4xl font-semibold text-white font-serif&quot;
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
                <span className="text-gray-300" style={{ fontSize: 13 }}>
                  About Me
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;/
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  h1
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
              </div>

              <span className="pl-12 sm:pl-16" style={{ fontSize: 13 }}>
                -
              </span>

              {/* p intro */}
              <div className="flex flex-row pl-12 sm:pl-16 whitespace-nowrap">
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  p
                </span>
                <Sp3 />
                <span className="text-blue-300" style={{ fontSize: 13 }}>
                  className
                </span>
                <Sp3 />
                <span className="text-white" style={{ fontSize: 13 }}>
                  =
                </span>
                <span className="text-orange-400" style={{ fontSize: 13 }}>
                  &quot;text-center mt-4 text-white/60 md:text-lg&quot;
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
              </div>

              {[
                "Hi! I'm Saman Esmaellpour, a full-stack developer and a member of the Turing group,",
                "specializing in React.js, Next.js, JavaScript, Node.js, Python, C#, and C++.",
                "Combining deep technical knowledge with a passion for problem-solving, I've worked",
                "on diverse projects ranging from cloud-based services to real-time applications.",
                "I'm committed to delivering clean, maintainable, and scalable code while helping",
                "businesses innovate and grow.",
              ].map((line, i) => (
                <span
                  key={i}
                  className="pl-16 sm:pl-20 text-gray-300 whitespace-nowrap"
                  style={{ fontSize: 13 }}
                >
                  {line}
                </span>
              ))}

              <div className="flex flex-row pl-12 sm:pl-16 whitespace-nowrap">
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;/
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  p
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
              </div>

              {/* h1 Skills */}
              <div className="flex flex-row pl-12 sm:pl-16 whitespace-nowrap">
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  h1
                </span>
                <Sp3 />
                <span className="text-blue-300" style={{ fontSize: 13 }}>
                  className
                </span>
                <span className="text-white" style={{ fontSize: 13 }}>
                  =
                </span>
                <span className="text-orange-400" style={{ fontSize: 13 }}>
                  &quot;text-4xl font-semibold text-white font-serif&quot;
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
                <span className="text-gray-300" style={{ fontSize: 13 }}>
                  Skills
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;/
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  h1
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
              </div>
              <span className="pl-12 sm:pl-16" style={{ fontSize: 13 }}>
                -
              </span>

              {/* skill arrays */}
              {[
                {
                  name: "frontendSkills",
                  items: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "React.js",
                    "Next.js",
                    "Tailwind CSS",
                  ],
                },
                {
                  name: "backendSkills",
                  items: [
                    "Node.js",
                    "Express.js",
                    "Python",
                    "Django",
                    "C#",
                    "C++",
                  ],
                },
                {
                  name: "databaseSkills",
                  items: [
                    "MongoDB",
                    "PostgreSQL",
                    "Firebase",
                    "MySQL",
                    "Redis",
                  ],
                },
                {
                  name: "mobileSkills",
                  items: ["Flutter", "Dart", "React Native"],
                },
                { name: "tools", items: ["Git", "VS Code", "Figma", "Docker"] },
              ].map(({ name, items }, idx) => (
                <div
                  key={idx}
                  className={`flex flex-row pl-12 sm:pl-16 ${idx > 0 ? "mt-2" : ""} whitespace-nowrap`}
                >
                  <span className="text-purple-400" style={{ fontSize: 13 }}>
                    const
                  </span>
                  <Sp3 />
                  <span className="text-yellow-300" style={{ fontSize: 13 }}>
                    {name}
                  </span>
                  <Sp3 />
                  <span className="text-white" style={{ fontSize: 13 }}>
                    =
                  </span>
                  <Sp3 />
                  <span className="text-yellow-300" style={{ fontSize: 13 }}>
                    [
                  </span>
                  {items.map((item, ii) => (
                    <span
                      key={ii}
                      className="text-orange-300"
                      style={{ fontSize: 13 }}
                    >
                      &quot;{item}&quot;{ii < items.length - 1 ? "," : ""}
                      {ii < items.length - 1 ? <Sp4 /> : null}
                    </span>
                  ))}
                  <span className="text-yellow-300" style={{ fontSize: 13 }}>
                    ]
                  </span>
                  <span className="text-white" style={{ fontSize: 13 }}>
                    ;
                  </span>
                </div>
              ))}

              {/* closing tags */}
              <div className="flex flex-row pl-8 sm:pl-12 mt-2 whitespace-nowrap">
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &lt;/
                </span>
                <span className="text-green-400" style={{ fontSize: 13 }}>
                  div
                </span>
                <span className="text-gray-500" style={{ fontSize: 13 }}>
                  &gt;
                </span>
              </div>
              <div className="flex flex-row pl-4 sm:pl-6 whitespace-nowrap">
                <span className="text-gray-400" style={{ fontSize: 13 }}>
                  )
                </span>
                <span className="text-white" style={{ fontSize: 13 }}>
                  ;
                </span>
              </div>
              <div className="flex flex-row whitespace-nowrap">
                <span
                  className="text-yellow-300"
                  style={{ fontSize: 13 }}
                >{`}`}</span>
                <span className="text-white" style={{ fontSize: 13 }}>
                  ;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex flex-row items-center justify-between bg-[#007acc] px-2 sm:px-4 py-0.5 sm:py-1 border-t border-[#2d2d2d] overflow-x-auto flex-shrink-0">
          <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="icon-[octicon--git-branch-16] w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            <span
              className="text-white whitespace-nowrap"
              style={{ fontSize: 11 }}
            >
              main*
            </span>
            <span className="icon-[octicon--sync-16] w-2.5 h-2.5 sm:w-3 sm:h-3 text-white hidden sm:block" />
            <span
              className="text-white whitespace-nowrap hidden sm:block"
              style={{ fontSize: 11 }}
            >
              0 ⚠ 0
            </span>
          </div>
          <div className="flex flex-row items-center gap-2 sm:gap-4 flex-shrink-0">
            <span
              className="text-white whitespace-nowrap hidden md:block"
              style={{ fontSize: 11 }}
            >
              Ln 24, Col 1
            </span>
            <span
              className="text-white whitespace-nowrap hidden lg:block"
              style={{ fontSize: 11 }}
            >
              Spaces: 2
            </span>
            <span
              className="text-white whitespace-nowrap hidden md:block"
              style={{ fontSize: 11 }}
            >
              UTF-8
            </span>
            <span
              className="text-white whitespace-nowrap hidden lg:block"
              style={{ fontSize: 11 }}
            >
              CRLF
            </span>
            <span
              className="text-white whitespace-nowrap"
              style={{ fontSize: 11 }}
            >
              {`{ }`} TSX
            </span>
          </div>
        </div>
      </div>
    </WindowFloat>
  );
}

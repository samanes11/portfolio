"use client";

import Image from "next/image";
import WindowFloat from "../ui/WindowFloat";

interface ResumeWindowPCProps {
  onClose: () => void;
  onMinimize: () => void;
}

export default function ResumeWindowPC({ onClose, onMinimize }: ResumeWindowPCProps) {
  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      showMinimize
      padding={0}
      maxWidth="120vh"
      title="Resume"
      contentStyle={{ background: "white" }}
    >
      <style>{`
        @media (max-width: 768px) {
          .resume-container { transform: scale(1) !important; padding: 20px !important; }
          .resume-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .resume-header-title { font-size: 32px !important; letter-spacing: 2px !important; }
          .resume-header-subtitle { font-size: 18px !important; }
          .resume-sidebar { border-radius: 15px !important; padding: 20px 15px !important; }
          .resume-skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .resume-section-title { font-size: 22px !important; }
          .resume-job-title { font-size: 16px !important; }
          .resume-year { font-size: 14px !important; }
        }
        @media (max-width: 480px) {
          .resume-header-title { font-size: 24px !important; letter-spacing: 1px !important; }
          .resume-header-subtitle { font-size: 16px !important; }
          .resume-skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="resume-container"
        style={{
          background: "white",
          minHeight: 600,
          direction: "ltr",
          transform: "scale(0.70)",
          transformOrigin: "top center",
          padding: "0 30px 30px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div className="resume-header-title" style={{ fontSize: 56, fontWeight: 900, letterSpacing: 6, marginBottom: 8, fontFamily: "Arial, sans-serif" }}>
            SAMAN ESMAELLPOUR
          </div>
          <div className="resume-header-subtitle" style={{ fontSize: 24, fontStyle: "italic", fontWeight: 300, color: "#333", marginBottom: 15, fontFamily: "Georgia, serif" }}>
            Full-Stack Developer (QE)
          </div>
        </div>

        {/* Body */}
        <div className="resume-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 30 }}>
          {/* Sidebar */}
          <div className="resume-sidebar" style={{ background: "#1a1a1a", color: "white", padding: "30px 25px", borderRadius: 25 }}>
            {/* Avatar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Image src="/1.jpg" alt="Saman" width={100} height={100} className="rounded-full object-cover" style={{ margin: 20 }} />
            </div>

            {/* About Me */}
            <div style={{ marginBottom: 30 }}>
              <div className="resume-section-title" style={{ fontSize: 22, color: "#15698D", marginBottom: 15, fontStyle: "italic", fontFamily: "Georgia, serif" }}>About Me</div>
              {[
                { icon: "icon-[ic--sharp-location-on]", label: "Location", value: "Shiraz, Iran" },
                { icon: "icon-[ic--baseline-email]",    label: "Email",    value: "samanes0011@gmail.com" },
                { icon: "icon-[material-symbols--language]", label: "Portfolio", value: "www.saman11.ir" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ marginBottom: 12, fontSize: 13, display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span className={`${icon} w-[16px] h-[16px] text-[#15698D] flex-shrink-0 mt-0.5`} />
                  <span>{label}<br />{value}</span>
                </div>
              ))}
            </div>

            {/* Software/Tools */}
            <div style={{ marginBottom: 30 }}>
              <div className="resume-section-title" style={{ fontSize: 22, color: "#15698D", marginBottom: 15, fontStyle: "italic", fontFamily: "Georgia, serif" }}>Software/Tools</div>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {["VS Code","WebStorm","PyCharm","Git & GitHub","Adobe Photoshop","Adobe Premiere Pro","Docker","MongoDB Compass","Postman","Figma"].map((t) => (
                  <li key={t} style={{ padding: "4px 0", fontSize: 13 }}>{t}</li>
                ))}
              </ul>
            </div>

            {/* References */}
            <div style={{ marginBottom: 30 }}>
              <div className="resume-section-title" style={{ fontSize: 22, color: "#15698D", marginBottom: 15, fontStyle: "italic", fontFamily: "Georgia, serif" }}>References</div>
              <div style={{ marginBottom: 15 }}>
                <div style={{ color: "#15698D", fontWeight: "bold", marginBottom: 5, display: "flex", alignItems: "center", gap: 5 }}>🔗 Turing Team</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>Available on request</div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div>
            <div style={{ lineHeight: 1.7, color: "#333", marginBottom: 30, textAlign: "justify" }}>
              I&apos;m a senior full-stack developer and proud member of the Turing research group, specializing in React.js, Next.js, JavaScript, Node.js, Python, C#, and C++. Combining deep technical knowledge with a passion for problem-solving, I&apos;ve worked on diverse projects ranging from cloud-based services to real-time applications. I&apos;m committed to delivering clean, maintainable, and scalable code while helping businesses innovate and grow.
            </div>

            {/* Work Experience */}
            <Section title="Work Experience">
              <JobEntry title="Senior Developer" year="2022 - Present" company="Turing Team" bullets={[
                "Built responsive web applications for various clients using React.js and Next.js frameworks",
                "Mentoring junior developers and conducting code reviews to maintain high code quality standards",
                "Collaborated with cross-functional teams to deliver scalable solutions for cloud-based services",
              ]} />
            </Section>

            {/* Skills */}
            <Section title="Skills">
              <div className="resume-skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 15 }}>
                {["QE","JavaScript","TypeScript","Python","C++","C#","Next.js","React.js","Node.js","Tailwind CSS","Flutter","MongoDB"].map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, background: "#000", borderRadius: "50%", display: "inline-block" }} />
                    {s}
                  </div>
                ))}
              </div>
            </Section>

            {/* Education */}
            <Section title="Education">
              <JobEntry title="Computer Engineering" year="2023 - 2027" company="Islamic Azad University" />
              <JobEntry title="High School Diploma" year="2016 - 2022" company="Sampad" />
            </Section>
          </div>
        </div>
      </div>
    </WindowFloat>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 35 }}>
      <div style={{ borderBottom: "2px solid #000", paddingBottom: 8, marginBottom: 20 }}>
        <div className="resume-section-title" style={{ fontSize: 28, fontStyle: "italic", fontFamily: "Georgia, serif" }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function JobEntry({ title, year, company, bullets }: { title: string; year: string; company: string; bullets?: string[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5, flexWrap: "wrap", gap: 10 }}>
        <div className="resume-job-title" style={{ fontSize: 18, fontWeight: "bold" }}>{title}</div>
        <div className="resume-year" style={{ fontSize: 16, fontWeight: "bold" }}>{year}</div>
      </div>
      <div style={{ fontSize: 14, marginBottom: 10, color: "#555" }}>{company}</div>
      {bullets && (
        <ul style={{ listStyle: "disc", marginLeft: 20 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: 6, lineHeight: 1.5, fontSize: 14 }}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

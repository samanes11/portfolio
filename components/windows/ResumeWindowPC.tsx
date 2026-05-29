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
      maxWidth="900px"
      title="Resume"
      contentStyle={{ background: "white" }}
    >
      <style>{`
        .resume-container {
          background: white;
          direction: ltr;
          padding: 30px 40px 40px;
          overflow-x: hidden;
        }
        .resume-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: stretch;
        }
        .resume-header-title {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 5px;
          margin-bottom: 8px;
          font-family: Arial, sans-serif;
          color: #111;
        }
        .resume-header-subtitle {
          font-size: 20px;
          font-style: italic;
          font-weight: 300;
          color: #444;
          margin-bottom: 15px;
          font-family: Georgia, serif;
        }
        .resume-sidebar {
          background: #1a1a1a;
          color: white;
          padding: 25px 20px;
          border-radius: 20px;
        }
        .resume-section-title {
          font-size: 20px;
          color: #15698D;
          margin-bottom: 12px;
          font-style: italic;
          font-family: Georgia, serif;
        }
        .resume-main-section-title {
          font-size: 24px;
          font-style: italic;
          font-family: Georgia, serif;
          color: #111;
        }
        .resume-skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .resume-job-title {
          font-size: 17px;
          font-weight: bold;
          color: #111;
        }
        .resume-year {
          font-size: 15px;
          font-weight: bold;
          color: #111;
        }
        .resume-company {
          font-size: 14px;
          color: #555;
          margin-bottom: 8px;
        }
        .resume-bio {
          line-height: 1.7;
          color: #333;
          margin-bottom: 28px;
          text-align: justify;
          font-size: 14px;
        }
        .resume-skill-bullet {
          width: 6px;
          height: 6px;
          background: #15698D;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .resume-container { padding: 20px !important; }
          .resume-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .resume-header-title { font-size: 28px !important; letter-spacing: 2px !important; }
          .resume-header-subtitle { font-size: 16px !important; }
          .resume-sidebar { border-radius: 15px !important; }
          .resume-skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .resume-section-title { font-size: 18px !important; }
          .resume-main-section-title { font-size: 20px !important; }
        }
        @media (max-width: 480px) {
          .resume-header-title { font-size: 22px !important; letter-spacing: 1px !important; }
          .resume-skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="resume-container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="resume-header-title">SAMAN ESMAELLPOUR</div>
          <div className="resume-header-subtitle">Full-Stack Developer (QE)</div>
        </div>

        {/* Body */}
        <div className="resume-grid">
          {/* Sidebar */}
          <div className="resume-sidebar">
            {/* Avatar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Image
                src="/1.jpg"
                alt="Saman"
                width={90}
                height={90}
                className="rounded-full object-cover"
              />
            </div>

            {/* About Me */}
            <div style={{ marginBottom: 28 }}>
              <div className="resume-section-title">About Me</div>
              {[
                { icon: "icon-[ic--sharp-location-on]",      label: "Location",  value: "Shiraz, Iran" },
                { icon: "icon-[ic--baseline-email]",         label: "Email",     value: "samanes0011@gmail.com" },
                { icon: "icon-[material-symbols--language]", label: "Portfolio", value: "www.es-saman.ir" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ marginBottom: 12, fontSize: 13, display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span className={`${icon} w-[15px] h-[15px] text-[#15698D] flex-shrink-0 mt-0.5`} />
                  <span>
                    <span style={{ color: "#aaa", display: "block", fontSize: 11 }}>{label}</span>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Software/Tools */}
            <div style={{ marginBottom: 28 }}>
              <div className="resume-section-title">Software / Tools</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "VS Code", "WebStorm", "PyCharm",
                  "Git & GitHub", "Adobe Photoshop", "Adobe Premiere Pro",
                  "Docker", "MongoDB Compass", "Postman", "Figma",
                ].map((t) => (
                  <li key={t} style={{ padding: "3px 0", fontSize: 13, color: "#ddd" }}>{t}</li>
                ))}
              </ul>
            </div>

            {/* References */}
            <div>
              <div className="resume-section-title">References</div>
              <div>
                <div style={{ color: "#15698D", fontWeight: "bold", marginBottom: 4, fontSize: 14 }}>
                  🔗 Turing Team
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>Available on request</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <p className="resume-bio">
              I&apos;m a senior full-stack developer and proud member of the Turing research group,
              specializing in React.js, Next.js, JavaScript, Node.js, Python, C#, and C++.
              Combining deep technical knowledge with a passion for problem-solving, I&apos;ve
              worked on diverse projects ranging from cloud-based services to real-time applications.
              I&apos;m committed to delivering clean, maintainable, and scalable code while helping
              businesses innovate and grow.
            </p>

            {/* Work Experience */}
            <Section title="Work Experience">
              <JobEntry
                title="Senior Developer"
                year="2022 – Present"
                company="Turing Team"
                bullets={[
                  "Built responsive web applications for various clients using React.js and Next.js frameworks",
                  "Mentored junior developers and conducted code reviews to maintain high code quality standards",
                  "Collaborated with cross-functional teams to deliver scalable solutions for cloud-based services",
                ]}
              />
            </Section>

            {/* Skills */}
            <Section title="Skills">
              <div className="resume-skills-grid">
                {[
                  "QE", "JavaScript", "TypeScript",
                  "Python", "C++", "C#",
                  "Next.js", "React.js", "Node.js",
                  "Tailwind CSS", "Flutter", "MongoDB",
                ].map((s) => (
                  <div key={s} style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#0d4f6b",
                    background: "#e4f2f7",
                    border: "1px solid #b3d6e4",
                    borderRadius: 6,
                    padding: "4px 10px",
                    textAlign: "center",
                  }}>
                    {s}
                  </div>
                ))}
              </div>
            </Section>

            {/* Education */}
            <Section title="Education">
              <JobEntry title="Computer Engineering" year="2023 – 2027" company="Islamic Azad University" />
              <JobEntry title="High School Diploma"  year="2016 – 2022" company="Sampad" />
            </Section>
          </div>
        </div>
      </div>
    </WindowFloat>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ borderBottom: "2px solid #222", paddingBottom: 6, marginBottom: 16 }}>
        <div className="resume-main-section-title">{title}</div>
      </div>
      {children}
    </div>
  );
}

function JobEntry({
  title,
  year,
  company,
  bullets,
}: {
  title: string;
  year: string;
  company: string;
  bullets?: string[];
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 4,
        }}
      >
        <div className="resume-job-title">{title}</div>
        <div className="resume-year">{year}</div>
      </div>
      <div className="resume-company">{company}</div>
      {bullets && (
        <ul style={{ listStyle: "disc", marginLeft: 18, marginTop: 6 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ marginBottom: 5, lineHeight: 1.6, fontSize: 14, color: "#333" }}>
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
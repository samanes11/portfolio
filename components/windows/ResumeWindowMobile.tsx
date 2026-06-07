"use client";

import WindowFloat from "../ui/WindowFloat";

export default function ResumeWindowMobile({
  onClose,
  onMinimize,
}: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  const handleDownload = async () => {
    const url = "https://qepal.com/i/uVM5n";
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Connection failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "SamanResume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert(`Download failed: ${e}`);
    }
  };

  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      padding={0}
      maxWidth="92vw"
      title="resume.pdf"
      contentStyle={{ background: "#0d0d0d" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

        .rm-root {
          font-family: 'DM Mono', monospace;
          color: #e8e0d4;
          direction: ltr;
        }

        /* Hero strip */
        .rm-hero {
          position: relative;
          padding: 28px 22px 22px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1208 0%, #0d0d0d 60%);
          border-bottom: 1px solid rgba(255,210,100,0.12);
        }
        .rm-hero::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,180,40,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .rm-hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c8922a;
          background: rgba(200,146,42,0.1);
          border: 1px solid rgba(200,146,42,0.25);
          border-radius: 4px;
          padding: 3px 8px;
          margin-bottom: 10px;
        }
        .rm-hero-name {
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          line-height: 1.1;
          color: #f5ead6;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .rm-hero-name em {
          font-style: italic;
          color: #c8922a;
        }
        .rm-hero-role {
          font-size: 10px;
          letter-spacing: 0.14em;
          color: #6b6050;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .rm-contact-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .rm-contact-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: #7a6e62;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          padding: 4px 8px;
        }

        /* Sections */
        .rm-body {
          padding: 0 0 20px;
        }
        .rm-section {
          padding: 18px 22px 0;
        }
        .rm-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .rm-section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(200,146,42,0.3), transparent);
        }
        .rm-section-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c8922a;
          font-weight: 500;
        }

        /* Timeline card */
        .rm-card {
          position: relative;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          margin-bottom: 10px;
        }
        .rm-card::before {
          content: '';
          position: absolute;
          left: 0; top: 12px; bottom: 12px;
          width: 2px;
          border-radius: 2px;
          background: linear-gradient(to bottom, #c8922a, rgba(200,146,42,0.1));
        }
        .rm-card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 15px;
          color: #f0e6d3;
          margin-bottom: 2px;
        }
        .rm-card-meta {
          font-size: 10px;
          color: #6b6050;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rm-card-meta span {
          display: inline-block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #4a3f35;
        }
        .rm-card-desc {
          font-size: 11px;
          line-height: 1.7;
          color: #6b6050;
        }

        /* Skills grid */
        .rm-skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .rm-skill-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7px 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          font-size: 10px;
          color: #9a8e82;
          text-align: center;
          letter-spacing: 0.02em;
          transition: border-color 0.2s, color 0.2s;
        }
        .rm-skill-chip:hover {
          border-color: rgba(200,146,42,0.3);
          color: #c8922a;
        }

        /* Download button */
        .rm-download {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 20px 22px 0;
          padding: 13px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(200,146,42,0.15), rgba(200,146,42,0.08));
          border: 1px solid rgba(200,146,42,0.3);
          color: #c8922a;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          transition: background 0.2s, border-color 0.2s;
          width: calc(100% - 44px);
        }
        .rm-download:hover {
          background: linear-gradient(135deg, rgba(200,146,42,0.25), rgba(200,146,42,0.15));
          border-color: rgba(200,146,42,0.5);
        }

        /* Divider */
        .rm-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 18px 0 0;
        }
      `}</style>

      <div className="rm-root">
        {/* Hero */}
        <div className="rm-hero">
          <div className="rm-hero-tag">
            <span className="icon-[mdi--circle] w-[6px] h-[6px]" style={{ color: '#c8922a' }} />
            Available for work
          </div>
          <div className="rm-hero-name">Saman<br /><em>Esmaellpour</em></div>
          <div className="rm-hero-role">Full-Stack Developer · QE</div>
          <div className="rm-contact-row">
            {[
              { icon: "icon-[mdi--map-marker]", text: "Shiraz, Iran" },
              { icon: "icon-[mdi--email]",      text: "samanes0011@gmail.com" },
              { icon: "icon-[mdi--web]",         text: "es-saman.ir" },
            ].map(({ icon, text }) => (
              <div className="rm-contact-chip" key={text}>
                <span className={`${icon} w-[11px] h-[11px]`} style={{ color: '#c8922a' }} />
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="rm-body">
          {/* Experience */}
          <div className="rm-section">
            <div className="rm-section-header">
              <span className="rm-section-title">Experience</span>
              <div className="rm-section-line" />
            </div>
            <div className="rm-card">
              <div className="rm-card-title">Senior Developer</div>
              <div className="rm-card-meta">Turing Team <span/> 2022 – Present</div>
              <div className="rm-card-desc">
                Built responsive web apps for diverse clients using React.js and Next.js.
                Mentored junior devs, conducted code reviews, and shipped cloud-based & real-time solutions.
              </div>
            </div>
          </div>

          <div className="rm-divider" />

          {/* Education */}
          <div className="rm-section">
            <div className="rm-section-header">
              <span className="rm-section-title">Education</span>
              <div className="rm-section-line" />
            </div>
            <div className="rm-card">
              <div className="rm-card-title">Computer Engineering</div>
              <div className="rm-card-meta">Islamic Azad University <span/> 2023–2027</div>
            </div>
            <div className="rm-card">
              <div className="rm-card-title">High School Diploma</div>
              <div className="rm-card-meta">Sampad <span/> 2016–2022</div>
            </div>
          </div>

          <div className="rm-divider" />

          {/* Skills */}
          <div className="rm-section">
            <div className="rm-section-header">
              <span className="rm-section-title">Skills</span>
              <div className="rm-section-line" />
            </div>
            <div className="rm-skills-grid">
              {[
                "React.js","Next.js","TypeScript",
                "Node.js","Python","C++",
                "Flutter","MongoDB","Docker",
                "Tailwind","Figma","Git",
              ].map((s) => (
                <div className="rm-skill-chip" key={s}>{s}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Download */}
        <button className="rm-download" onClick={handleDownload}>
          <span className="icon-[mdi--download] w-[14px] h-[14px]" />
          Download PDF
        </button>
      </div>
    </WindowFloat>
  );
}
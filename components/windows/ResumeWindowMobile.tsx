"use client";

import WindowFloat from "../ui/WindowFloat";

export default function ResumeWindowMobile({
  onClose,
  onMinimize,
}: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  const handlePrint = async () => {
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
      padding={20}
      maxWidth="80vh"
      title="Resume"
      contentStyle={{
        background: "linear-gradient(135deg, rgba(212,219,241,0.82), rgba(35,29,49,0.82))",
      }}
    >
      <div className="flex flex-col gap-6" style={{ direction: "ltr" }}>
        {/* Experience */}
        <div className="flex flex-col">
          <div className="flex flex-row items-center font-bold mb-4 gap-2">
            <span className="icon-[material-symbols--work] w-[22px] h-[22px] text-blue-500" />
            <span className="font-bold" style={{ fontSize: 18 }}>Experience</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800" style={{ fontSize: 16 }}>Senior Developer</span>
              <span className="text-gray-600" style={{ fontSize: 13 }}>Turing Team. • 2022 - Present</span>
              <span className="text-gray-700 mt-2" style={{ fontSize: 13 }}>
                Built responsive web applications for various clients and mentoring junior developers.
              </span>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="flex flex-col">
          <div className="flex flex-row items-center font-bold mb-4 gap-2">
            <span className="icon-[mdi--account-school] w-[26px] h-[26px] text-blue-500" />
            <span className="font-bold" style={{ fontSize: 18 }}>Education</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800" style={{ fontSize: 14 }}>Computer Engineering</span>
              <span className="text-gray-600" style={{ fontSize: 13 }}>Islamic Azad University • 2023 - 2027</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800" style={{ fontSize: 14 }}>High School Diploma</span>
              <span className="text-gray-600" style={{ fontSize: 13 }}>Sampad • 2016 - 2022</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="self-start px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-mono text-sm"
        >
          Download PDF
        </button>
      </div>
    </WindowFloat>
  );
}

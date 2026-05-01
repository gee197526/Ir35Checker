import { useState } from "react";

const questions = [
  {
    id: 1,
    category: "Control",
    text: "Does the client control how and when you work (hours, location, method)?",
    inside: true,
    help: "If the client dictates your working hours, location, or how you carry out the work, this points inside IR35."
  },
  {
    id: 2,
    category: "Substitution",
    text: "Can you send a substitute to do the work in your place (and have done so, or genuinely could)?",
    inside: false,
    help: "A genuine right of substitution — not just theoretical — is a strong outside indicator."
  },
  {
    id: 3,
    category: "Mutuality of Obligation",
    text: "Is the client obliged to offer you work, and are you obliged to accept it?",
    inside: true,
    help: "If there's an expectation of ongoing work on both sides, this suggests employment-like terms."
  },
  {
    id: 4,
    category: "Financial Risk",
    text: "Do you bear financial risk — e.g. fixing errors at your own cost, or risk of not being paid if work is unsatisfactory?",
    inside: false,
    help: "True contractors take on financial risk. Employees are paid regardless of output quality."
  },
  {
    id: 5,
    category: "Integration",
    text: "Are you integrated into the client's organisation — attending staff meetings, using their email, on their org chart?",
    inside: true,
    help: "Being treated like an employee internally is a strong inside indicator."
  },
  {
    id: 6,
    category: "Equipment",
    text: "Do you use your own equipment and tools to carry out the work?",
    inside: false,
    help: "Providing your own kit suggests genuine self-employment."
  },
  {
    id: 7,
    category: "Multiple Clients",
    text: "Do you work for multiple clients simultaneously or in close succession?",
    inside: false,
    help: "Working for several clients at once is a hallmark of genuine self-employment."
  },
  {
    id: 8,
    category: "Contract",
    text: "Does your contract specify a defined deliverable or project outcome (rather than a time-based role)?",
    inside: false,
    help: "Outcome-based contracts lean outside IR35. Time-and-materials with no defined end looks more like employment."
  },
  {
    id: 9,
    category: "Exclusivity",
    text: "Are you prohibited from working for other clients while engaged with this one?",
    inside: true,
    help: "Exclusivity clauses are an employment characteristic."
  },
  {
    id: 10,
    category: "Notice & Continuity",
    text: "Has the engagement continued for a long time with no fixed end date, or rolls over repeatedly?",
    inside: true,
    help: "Long-running, open-ended engagements start to resemble permanent employment."
  }
];

const categoryColors = {
  Control: "#e07b39",
  Substitution: "#4a9e7f",
  "Mutuality of Obligation": "#c0505a",
  "Financial Risk": "#4a9e7f",
  Integration: "#c0505a",
  Equipment: "#4a9e7f",
  "Multiple Clients": "#4a9e7f",
  Contract: "#4a9e7f",
  Exclusivity: "#c0505a",
  "Notice & Continuity": "#c0505a"
};

export default function IR35Checker() {
  const [answers, setAnswers] = useState({});
  const [showHelp, setShowHelp] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const total = questions.length;

  const score = () => {
    let insidePoints = 0;
    let outsidePoints = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined) return;
      const yesIsInside = q.inside;
      if (ans === "yes") yesIsInside ? insidePoints++ : outsidePoints++;
      if (ans === "no") yesIsInside ? outsidePoints++ : insidePoints++;
    });
    return { insidePoints, outsidePoints };
  };

  const verdict = () => {
    const { insidePoints, outsidePoints } = score();
    const diff = outsidePoints - insidePoints;
    if (diff >= 4) return { label: "Likely Outside IR35", color: "#4a9e7f", risk: "low" };
    if (diff >= 1) return { label: "Borderline — Leans Outside", color: "#8fbe6a", risk: "medium-low" };
    if (diff === 0) return { label: "Borderline — Unclear", color: "#e0a030", risk: "medium" };
    if (diff >= -2) return { label: "Borderline — Leans Inside", color: "#e07b39", risk: "medium-high" };
    return { label: "Likely Inside IR35", color: "#c0505a", risk: "high" };
  };

  const toggleHelp = id => setShowHelp(h => ({ ...h, [id]: !h[id] }));
  const setAnswer = (id, val) => setAnswers(a => ({ ...a, [id]: val }));
  const reset = () => { setAnswers({}); setShowHelp({}); setSubmitted(false); };

  const v = submitted ? verdict() : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e0d4",
      padding: "0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-answer {
          border: 1px solid #3a3530;
          background: transparent;
          color: #a09880;
          padding: 8px 20px;
          cursor: pointer;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: all 0.15s ease;
          border-radius: 2px;
        }
        .btn-answer:hover { border-color: #6a6050; color: #e8e0d4; }
        .btn-answer.active-yes { background: #4a9e7f22; border-color: #4a9e7f; color: #4a9e7f; }
        .btn-answer.active-no { background: #c0505a22; border-color: #c0505a; color: #c0505a; }
        .help-btn {
          background: none; border: none; cursor: pointer;
          color: #5a5040; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; font-family: 'Source Sans 3', sans-serif;
          padding: 4px 0; transition: color 0.15s;
        }
        .help-btn:hover { color: #8a7a60; }
        .submit-btn {
          background: #e8e0d4; color: #0f0f0f;
          border: none; padding: 14px 40px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 13px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s; border-radius: 2px;
        }
        .submit-btn:hover { background: #fff; }
        .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .reset-btn {
          background: none; border: 1px solid #3a3530;
          color: #6a6050; padding: 10px 28px;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 12px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          transition: all 0.2s; border-radius: 2px;
        }
        .reset-btn:hover { border-color: #6a6050; color: #a09880; }
        .progress-bar {
          height: 2px; background: #1e1e1e;
          position: relative; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: #8a7a60;
          transition: width 0.3s ease;
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e1e", padding: "40px 0 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#5a5040", textTransform: "uppercase", fontFamily: "'Source Sans 3', sans-serif", marginBottom: 16 }}>
            IR35 Status Assessment
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#e8e0d4" }}>
            Are you inside<br />or outside IR35?
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#6a6050", marginTop: 16, lineHeight: 1.7, fontWeight: 300 }}>
            10 questions. Indicative result only — not legal advice. Always get a professional determination for any contract of significance.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(answered / total) * 100}%` }} />
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px" }}>

        {!submitted ? (
          <>
            {questions.map((q, i) => (
              <div key={q.id} style={{
                borderBottom: "1px solid #1a1a1a",
                paddingBottom: 28, marginBottom: 28
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{
                    minWidth: 28, height: 28, borderRadius: "50%",
                    border: `1px solid ${answers[q.id] ? categoryColors[q.category] : "#2a2520"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Source Sans 3', sans-serif", fontSize: 11,
                    color: answers[q.id] ? categoryColors[q.category] : "#3a3530",
                    flexShrink: 0, marginTop: 2,
                    transition: "all 0.2s"
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", color: categoryColors[q.category] || "#6a6050", textTransform: "uppercase", fontFamily: "'Source Sans 3', sans-serif", marginBottom: 8, opacity: 0.8 }}>
                      {q.category}
                    </div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, lineHeight: 1.5, color: "#d8d0c4", marginBottom: 16 }}>
                      {q.text}
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <button
                        className={`btn-answer${answers[q.id] === "yes" ? " active-yes" : ""}`}
                        onClick={() => setAnswer(q.id, "yes")}
                      >Yes</button>
                      <button
                        className={`btn-answer${answers[q.id] === "no" ? " active-no" : ""}`}
                        onClick={() => setAnswer(q.id, "no")}
                      >No</button>
                      <button className="help-btn" onClick={() => toggleHelp(q.id)}>
                        {showHelp[q.id] ? "hide note" : "why this matters"}
                      </button>
                    </div>
                    {showHelp[q.id] && (
                      <div style={{
                        marginTop: 12, padding: "12px 16px",
                        background: "#161410", borderLeft: "2px solid #3a3020",
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: 13,
                        color: "#7a7060", lineHeight: 1.6, fontWeight: 300
                      }}>
                        {q.help}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
              <button
                className="submit-btn"
                disabled={answered < total}
                onClick={() => setSubmitted(true)}
              >
                Get Result
              </button>
              {answered < total && (
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#3a3530" }}>
                  {total - answered} question{total - answered !== 1 ? "s" : ""} remaining
                </span>
              )}
            </div>
          </>
        ) : (
          <div>
            {/* Verdict */}
            <div style={{
              border: `1px solid ${v.color}33`,
              background: `${v.color}0a`,
              padding: "36px 32px", marginBottom: 40,
              borderRadius: 4
            }}>
              <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#5a5040", textTransform: "uppercase", fontFamily: "'Source Sans 3', sans-serif", marginBottom: 16 }}>
                Assessment Result
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, color: v.color, marginBottom: 16 }}>
                {v.label}
              </div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#6a6050", lineHeight: 1.8, fontWeight: 300, maxWidth: 520 }}>
                {v.risk === "low" && "Your answers suggest genuine self-employment characteristics. This is a positive indicator, but a formal determination from HMRC or a specialist is still advisable for significant contracts."}
                {v.risk === "medium-low" && "More outside than inside indicators, but not decisively. Review the inside-pointing answers and consider whether the contract wording reflects the working reality."}
                {v.risk === "medium" && "Your situation is genuinely ambiguous. This warrants professional advice before signing or renewing any contract — do not rely on this result."}
                {v.risk === "medium-high" && "More inside than outside indicators. You should review your contracts and working practices, and get professional advice. Trading inside IR35 has significant tax implications."}
                {v.risk === "high" && "Your answers suggest employment-like characteristics throughout. Inside IR35 means tax and NI are due as if you were an employee. Get professional advice urgently if you are not already compliant."}
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#4a4030", textTransform: "uppercase", fontFamily: "'Source Sans 3', sans-serif", marginBottom: 20 }}>
                Question Breakdown
              </div>
              {questions.map((q, i) => {
                const ans = answers[q.id];
                const yesIsInside = q.inside;
                const isInsideAnswer = (ans === "yes" && yesIsInside) || (ans === "no" && !yesIsInside);
                return (
                  <div key={q.id} style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    padding: "12px 0", borderBottom: "1px solid #161410"
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                      background: isInsideAnswer ? "#c0505a" : "#4a9e7f",
                      marginTop: 6
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: "#9a9080", lineHeight: 1.5 }}>
                        {q.text}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: "'Source Sans 3', sans-serif", fontSize: 11,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: isInsideAnswer ? "#c0505a" : "#4a9e7f",
                      flexShrink: 0, paddingTop: 2
                    }}>
                      {isInsideAnswer ? "Inside" : "Outside"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              padding: "16px 20px", background: "#0a0a0a",
              border: "1px solid #1a1a1a", marginBottom: 32,
              fontFamily: "'Source Sans 3', sans-serif", fontSize: 12,
              color: "#4a4030", lineHeight: 1.7, fontWeight: 300
            }}>
              This tool is for indicative purposes only and does not constitute legal or tax advice. For any contract where IR35 status is material, obtain a formal opinion from a qualified IR35 specialist or employment lawyer.
            </div>

            <button className="reset-btn" onClick={reset}>Start Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
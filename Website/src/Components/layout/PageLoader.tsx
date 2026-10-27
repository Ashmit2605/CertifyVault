export default function PageLoader() {
  return (
    <main className="cv-loader" role="status" aria-live="polite">
      <style>{`
        .cv-loader {
          --loader-navy: var(--navy, #000f3e);
          --loader-blue: var(--blue, #0050f5);
          --loader-bg: var(--bg-2, #f7f9ff);
          display: grid;
          min-height: 100vh;
          min-height: 100dvh;
          place-items: center;
          overflow: hidden;
          padding: 24px;
          background:
            radial-gradient(ellipse at 50% 40%, rgba(0, 80, 245, 0.08), transparent 45%),
            var(--loader-bg);
          color: var(--loader-navy);
          font-family: "Figtree", "Segoe UI", system-ui, sans-serif;
        }

        .cv-loader__content {
          display: flex;
          width: min(100%, 360px);
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: cv-loader-enter 420ms ease-out both;
        }

        .cv-loader__mark {
          position: relative;
          display: grid;
          width: 88px;
          height: 88px;
          place-items: center;
          margin-bottom: 26px;
          border: 1px solid rgba(0, 80, 245, 0.12);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 16px 40px rgba(0, 15, 62, 0.1);
        }

        .cv-loader__orbit {
          position: absolute;
          inset: -8px;
          border: 2px solid transparent;
          border-top-color: var(--loader-blue);
          border-right-color: rgba(0, 80, 245, 0.16);
          border-radius: 34px;
          animation: cv-loader-orbit 1.5s linear infinite;
        }

        .cv-loader__shield {
          width: 42px;
          height: 42px;
          color: var(--loader-blue);
          animation: cv-loader-glow 2s ease-in-out infinite;
        }

        .cv-loader__eyebrow {
          margin: 0 0 8px;
          color: var(--loader-blue);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .cv-loader__title {
          margin: 0;
          font-size: clamp(20px, 5vw, 24px);
          font-weight: 800;
          letter-spacing: -0.035em;
        }

        .cv-loader__description {
          margin: 8px 0 0;
          color: var(--loader-navy);
          font-size: 14px;
          opacity: 0.56;
        }

        .cv-loader__track {
          display: flex;
          width: 112px;
          gap: 6px;
          margin-top: 26px;
        }

        .cv-loader__segment {
          height: 4px;
          flex: 1;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(0, 80, 245, 0.12);
        }

        .cv-loader__segment::after {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: var(--loader-blue);
          content: "";
          transform: scaleX(0.18);
          transform-origin: left;
          animation: cv-loader-progress 1.4s ease-in-out infinite;
        }

        .cv-loader__segment:nth-child(2)::after {
          animation-delay: 180ms;
        }

        .cv-loader__segment:nth-child(3)::after {
          animation-delay: 360ms;
        }

        @keyframes cv-loader-orbit {
          to { transform: rotate(360deg); }
        }

        @keyframes cv-loader-glow {
          50% { filter: drop-shadow(0 0 8px rgba(0, 80, 245, 0.38)); }
        }

        @keyframes cv-loader-progress {
          0%, 100% { opacity: 0.45; transform: scaleX(0.18); }
          55% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes cv-loader-enter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .cv-loader__content,
          .cv-loader__orbit,
          .cv-loader__shield,
          .cv-loader__segment::after {
            animation: none;
          }

          .cv-loader__segment::after {
            opacity: 0.7;
            transform: scaleX(0.65);
          }
        }
      `}</style>

      <div className="cv-loader__content">
        <div className="cv-loader__mark" aria-hidden="true">
          <span className="cv-loader__orbit" />
          <svg
            className="cv-loader__shield"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4 7 11v11c0 10.1 6.9 19.5 17 22 10.1-2.5 17-11.9 17-22V11L24 4Z"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              d="m16.5 24 5 5 10-11"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="cv-loader__eyebrow">CertifyVault</p>
        <h1 className="cv-loader__title">Preparing your workspace</h1>
        <p className="cv-loader__description">Loading your secure dashboard...</p>
        <div className="cv-loader__track" aria-hidden="true">
          <span className="cv-loader__segment" />
          <span className="cv-loader__segment" />
          <span className="cv-loader__segment" />
        </div>
      </div>
    </main>
  );
}

import { ImageResponse } from "next/og";

export const alt = "TCG Egypt — Buy, sell and track Yu-Gi-Oh cards in Egypt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #12151d 0%, #0b0d12 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "88px",
              borderRadius: "14px",
              background: "#ff3b3b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#ffffff",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: "44px", fontWeight: 800 }}>
            <span>TC</span>
            <span style={{ color: "#ff3b3b" }}>G</span>
            <span style={{ color: "#8b93a1", marginLeft: "14px", letterSpacing: "6px" }}>
              EGYPT
            </span>
          </div>
        </div>

        <div style={{ fontSize: "68px", fontWeight: 800, lineHeight: 1.1, maxWidth: "900px" }}>
          Buy, sell &amp; track Yu-Gi-Oh cards in Egypt
        </div>

        <div style={{ fontSize: "32px", color: "#b3bac6", marginTop: "28px", maxWidth: "820px" }}>
          13,000+ cards · live market prices · local sellers
        </div>
      </div>
    ),
    { ...size }
  );
}

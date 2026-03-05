/**
 * Global loading indicator — uses a slim animated top bar so it
 * never covers base content. This avoids blocking FCP/LCP
 * (the previous full-screen overlay delayed both metrics significantly).
 *
 * Pure CSS animation (keyframes in globals.css) — zero JS bundle cost.
 */
export default function GlobalLoading() {
    return (
        <div
            className="fixed top-0 left-0 right-0 z-[100] h-[3px]"
            style={{ background: "rgba(0,0,0,0.04)" }}
        >
            <div
                className="h-full rounded-r-full"
                style={{
                    background: "linear-gradient(90deg, #F2542D 0%, #FF7E5F 50%, #F2542D 100%)",
                    animation: "loadingBar 1.4s ease-in-out infinite",
                }}
            />
        </div>
    );
}

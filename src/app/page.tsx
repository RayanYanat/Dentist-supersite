/**
 * Home / — placeholder.
 *
 * The real LockedScreen (premium 8-step GSAP entrance) lands in the next
 * commit. This stub keeps the route resolvable so dev/build don't fail
 * while the slug route is wired up.
 */
export default function LockedHome() {
  return (
    <main
      style={{
        minHeight:       "100vh",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        backgroundColor: "#0C0B09",
        color:           "rgba(216,210,200,0.4)",
      }}
    >
      <p className="font-data text-xs tracking-[0.4em] uppercase">
        Access Reserved
      </p>
    </main>
  );
}

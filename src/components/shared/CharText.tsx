/**
 * CharText — splits a string into individual character spans for stagger animation.
 *
 * Each character renders as `<span class="char-reveal inline-block" aria-hidden>`.
 * The wrapping `<span aria-label={text}>` keeps the original string accessible to
 * screen readers — so the visual splitting is purely cosmetic.
 *
 * GSAP animates the per-character spans via the `.char-reveal` class with stagger
 * for the classic "letters rising from below the line" reveal. The parent element
 * MUST have `overflow: hidden` and reasonable `padding` if you want the chars
 * properly clipped during their entrance.
 *
 * Usage:
 *   <h2 className="...">
 *     <span className="block overflow-hidden" style={{ padding: "0.05em 0 0.1em" }}>
 *       <CharText text="The Atelier's Voice" />
 *     </span>
 *   </h2>
 *
 *   gsap.set(".char-reveal", { y: "115%", opacity: 0 });
 *   gsap.to(".char-reveal", { y: "0%", opacity: 1, stagger: 0.025 });
 *
 * The `whiteSpace: "pre"` on each char preserves spaces (renders them as actual
 * gap rather than collapsing them) — needed because spans are inline-block.
 */
export default function CharText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="char-reveal inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

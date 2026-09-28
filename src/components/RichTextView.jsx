import DOMPurify from "dompurify";

// Every link that comes out of the rich text editor is underlined
// automatically (page CSS such as `a { text-decoration: none }` can't hide
// it), and links that open in a new tab get rel="noopener noreferrer".
// Registered once, when this module is first loaded.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.style.textDecoration = "underline";
    if (node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  }
});

// Old records (saved before the rich text editor existed) stored plain
// text with no tags. New records store HTML from RichTextField. This
// checks for an actual tag to tell the two apart.
const looksLikeHtml = (value) => /<[a-z][\s\S]*>/i.test(value || "");

// Converts RichTextField HTML into plain text for titles, alt text,
// truncated previews and word counts: tags become spaces (so adjacent
// paragraphs don't run together), entities like &nbsp; / &amp; are
// decoded, and whitespace is collapsed.
export const stripHtml = (html) => {
  if (!html || typeof html !== "string") return "";
  const withoutTags = html.replace(/<[^>]*>/g, " ");
  const doc = new DOMParser().parseFromString(withoutTags, "text/html");
  return (doc.documentElement.textContent || "").replace(/\s+/g, " ").trim();
};

const RichTextView = ({ html, className }) => {
  if (!html) return null;

  if (looksLikeHtml(html)) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      />
    );
  }

  // Plain text fallback: preserve line breaks, escape nothing since
  // React already treats this as text, not markup.
  return (
    <div className={className} style={{ whiteSpace: "pre-wrap" }}>
      {html}
    </div>
  );
};

/**
 * ---------------------------------------------------------------------
 * Formatted previews: show RichTextField HTML WITH its formatting
 * (colors, bold, links...) inside titles, cards and previews.
 *
 *   import RichTextView, { stripHtml, Rich } from "../components/RichTextView";
 *
 *   <Rich html={x} />                       inline text (titles, card previews)
 *   <Rich html={x} words={20} />            cut by words, tags stay balanced, "…" added
 *   <Rich html={x} inline={false} />        keep paragraphs / lists (full detail text)
 *   <Rich html={x} unwrapLinks={false} />   keep links clickable (and underlined).
 *                                           Use when NOT inside a <Link> / <a>.
 *   <Rich html={x} quote />                 wrap the text in "…"
 *   <Rich html={x} fallback="text" />       shown when the field is empty
 *
 * By default (unwrapLinks = true) links become underlined text, because an
 * <a> inside an <a> (e.g. a clickable card) is invalid HTML.
 * ---------------------------------------------------------------------
 */
export const prepareHtml = (html, { words, inline = true, unwrapLinks = true } = {}) => {
  if (!html) return "";
  if (typeof window === "undefined" || !window.DOMParser) return html;

  const doc = new DOMParser().parseFromString(`<div id="rt-root">${html}</div>`, "text/html");
  const root = doc.getElementById("rt-root");
  if (!root) return html;

  if (unwrapLinks) {
    root.querySelectorAll("a").forEach((a) => {
      const span = doc.createElement("span");
      span.style.textDecoration = "underline";
      while (a.firstChild) span.appendChild(a.firstChild);
      a.replaceWith(span);
    });
  }

  if (inline) {
    root.querySelectorAll("br").forEach((br) => br.replaceWith(doc.createTextNode(" ")));
    root
      .querySelectorAll("p,div,h1,h2,h3,h4,h5,h6,li,ul,ol,blockquote")
      .forEach((el) => {
        const span = doc.createElement("span");
        while (el.firstChild) span.appendChild(el.firstChild);
        span.appendChild(doc.createTextNode(" "));
        el.replaceWith(span);
      });
  }

  if (words) {
    let count = 0;
    let done = false;
    const trim = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (done) {
          child.remove();
          return;
        }
        if (child.nodeType === 3) {
          let out = "";
          for (const part of child.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              out += part;
              continue;
            }
            if (count >= words) {
              done = true;
              break;
            }
            count += 1;
            out += part;
          }
          child.textContent = done ? out.trimEnd() + "…" : out;
        } else if (child.nodeType === 1) {
          trim(child);
        }
      });
    };
    trim(root);
  }

  return root.innerHTML.trim();
};

export const Rich = ({
  html,
  words,
  inline = true,
  unwrapLinks = true,
  quote = false,
  className,
  fallback = null,
}) => {
  if (!stripHtml(html)) return fallback;

  let out;
  if (looksLikeHtml(html)) {
    out = prepareHtml(html, { words, inline, unwrapLinks });
  } else {
    // Old plain-text record: no tags to preserve, so cut it by words
    // directly (running it through the HTML parser would turn "&" into
    // "&amp;" and show that literally).
    let text = String(html);
    if (inline) text = text.replace(/\s+/g, " ").trim();
    if (words) {
      const parts = text.split(/\s+/);
      if (parts.length > words) text = parts.slice(0, words).join(" ") + "…";
    }
    out = text;
  }

  return <RichTextView className={className} html={quote ? `"${out}"` : out} />;
};

export default RichTextView;
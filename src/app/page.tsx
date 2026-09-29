"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MoodTracker } from "@/components/mood-tracker";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

// --- Configuration Constants ---
const TEXT_REPLACEMENTS = [
  { match: /\bAsh\b/g, replace: "Clarity" },
  { match: /talktoash/gi, replace: "Clarity" },
  { match: /Slingshot AI/gi, replace: "Clarity" },
  { match: /Slingshot/gi, replace: "Clarity" },
  { match: /download now/gi, replace: "Get Started" },
  { match: /download/gi, replace: "Get Started" }
];

const BANNED_PHRASES = [
  "daniel cahn",
  "daniel reid cahn",
  "neil parikh",
  "derrick hull",
  "caitlin stamatis",
  "mark ungless",
  "tom insel",
  "nina vasan",
  "pat arean",
  "devika bhushan",
  "lori gottlieb",
  "founder's note",
  "a founder's note",
  "why we built",
  "our people",
  "the team",
  "team clarity",
  "our experts and advisors",
  "clinical research team",
  "research advisory board",
  "slingshot",
  "slingshot ai",
  "introducing-ash",
  "announcing lori gottlieb",
  "begin your journey",
  "take the first step today",
  "not designed to be used in crisis",
  "if you are in crisis",
  "www.findahelpline.com"
];

const HIDDEN_IMAGE_SRCS = ["FesOF", "yu2Y2", "c2zff", "obvaZnUL", "5b1zfTys", "btNOZYHw", "Krp37kOR"];
const HIDDEN_LINKS = ["about us", "contact", "team", "careers", "our people", "people", "get in touch"];

// --- High-Performance CSS Injected Once into Iframe ---
const injectCleanStyles = (doc: Document) => {
  if (doc.getElementById("clarity-perf-styles")) return;
  const style = doc.createElement("style");
  style.id = "clarity-perf-styles";
  style.textContent = `
    /* Instant CSS cleanup with zero JS overhead */
    [data-framer-name="Team"],
    [data-framer-name="Our people"],
    [data-framer-name="The Team"],
    [data-framer-name="Advisors"],
    [data-framer-name="Resources"],
    [data-framer-name="GET IN TOUCH"],
    .framer-1og3o1n,
    .framer-6egu0i,
    .framer-1vwaaur,
    .framer-vsfxc2,
    .framer-7sn6w8,
    .framer-jablm,
    [data-framer-name="Socials"],
    div[style*="data:image/svg+xml"],
    a[href*="/people"],
    a[href*="/about"],
    a[href*="about"],
    a[href*="careers"],
    a[href*="mailto:"],
    a[href*="tel:"],
    a[href*="slingshotai.com"],
    a[href*="slingshot"],
    a[href*="founder-note"],
    a[href*="announcing-lori-gottlieb"],
    a[href*="instagram.com"],
    a[href*="facebook.com"],
    a[href*="reddit.com"],
    a[href*="x.com"],
    a[href*="youtube.com"],
    a[href*="apple.com"],
    a[href*="findahelpline.com"] {
      display: none !important;
    }

    /* Replace Ash logo in navbar with Clarity text */
    .framer-68xt2m {
      background-image: none !important;
    }
    .framer-68xt2m::after {
      content: 'Clarity' !important;
      font-family: 'DM Sans', -apple-system, sans-serif !important;
      font-weight: 800 !important;
      font-size: 26px !important;
      color: #262335 !important;
      display: inline-block !important;
      letter-spacing: -0.5px !important;
    }
  `;
  doc.head?.appendChild(style);
};

// --- Fast Targeted Node Cleanup ---
const applyTextReplacements = (doc: Document) => {
  const headingsAndP = doc.querySelectorAll("h1, h2, h3, h4, p, a, span, button");
  headingsAndP.forEach(el => {
    if (!el.childNodes.length) return;
    for (let i = 0; i < el.childNodes.length; i++) {
      const node = el.childNodes[i];
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
        let val = node.nodeValue;
        TEXT_REPLACEMENTS.forEach(({ match, replace }) => {
          val = val.replace(match, replace);
        });
        if (val !== node.nodeValue) {
          node.nodeValue = val;
        }
      }
    }
  });
};

const hideElements = (doc: Document) => {
  const elements = doc.querySelectorAll("a, h1, h2, h3, p, img, form");
  
  elements.forEach(el => {
    const text = el.textContent?.toLowerCase() || "";
    
    // Replace the research hero image with the new image
    if (el.tagName === "IMG") {
      const img = el as HTMLImageElement;
      if (img.src?.includes("EJg9MzKFPQelNYdLwUTVJcRBym0") || img.srcset?.includes("EJg9MzKFPQelNYdLwUTVJcRBym0")) {
        img.src = "/assets/chatgpt-research.png";
        img.srcset = "/assets/chatgpt-research.png 512w, /assets/chatgpt-research.png 1024w, /assets/chatgpt-research.png 2048w, /assets/chatgpt-research.png 3840w";
      }
      
      const srcMatch = HIDDEN_IMAGE_SRCS.some(src => img.src.includes(src));
      const altMatch = img.alt?.includes("Ash") || img.alt?.includes("logo");
      if (srcMatch || altMatch) {
        img.style.display = "none";
      }
    }
    
    // Replace logo anchor tags with Clarity text
    if (el.tagName === "A") {
      const href = el.getAttribute("href") || "";
      if ((href === "./" || href === "/") && !el.textContent?.trim()) {
        const hasSvg = el.querySelector("svg") || el.querySelector('[data-framer-component-type="SVG"]');
        if (hasSvg) {
          el.innerHTML = '<span style="font-size: 24px; font-weight: 800; color: #262335; font-family: \'DM Sans\', sans-serif; letter-spacing: -0.5px;">Clarity</span>';
          (el as HTMLElement).style.display = "flex";
          (el as HTMLElement).style.alignItems = "center";
          (el as HTMLElement).style.textDecoration = "none";
        }
      }

      // Hide dead links, site links, social links, or people links
      if (
        href.includes("/people") || 
        href.includes("/about") || 
        href.includes("slingshot") || 
        href.includes("instagram") ||
        href.includes("facebook") ||
        href.includes("reddit") ||
        href.includes("x.com") ||
        href.includes("youtube") ||
        HIDDEN_LINKS.some(link => text.includes(link))
      ) {
        (el as HTMLElement).style.display = "none";
      }
    }
    
    // Hide forms completely
    if (el.tagName === "FORM") {
      (el as HTMLElement).style.display = "none";
    }
    
    // Deep hide any card containing banned person names or founder notes
    if (BANNED_PHRASES.some(phrase => text.includes(phrase))) {
      const card = el.closest('a, [data-framer-name], .framer-1f4jhgs, .framer-1hgw4ef, [data-border="true"]') as HTMLElement || el.parentElement;
      if (card && card.tagName !== "BODY" && card.tagName !== "HTML") {
        card.style.display = "none";
      }
    }
  });
};

const hijackActionButtons = (doc: Document, isAuthenticated: boolean, router: AppRouterInstance) => {
  const buttons = doc.querySelectorAll("a, button");
  buttons.forEach(el => {
    const htmlEl = el as HTMLElement;
    const text = htmlEl.textContent?.trim().toLowerCase() || "";
    
    if (
      text.includes("download now") || 
      text.includes("download") || 
      text.includes("demo") || 
      text.includes("get started")
    ) {
      htmlEl.dataset.clarityHijacked = "true";
      htmlEl.innerHTML = `<span style="font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; letter-spacing: -0.2px;">Get Started</span>`;
      htmlEl.style.display = "flex";
      htmlEl.style.alignItems = "center";
      htmlEl.style.justifyContent = "center";
      htmlEl.style.textDecoration = "none";
      htmlEl.style.color = "#ffffff";
      htmlEl.style.padding = "0 32px";
      htmlEl.style.minWidth = "160px";
      
      htmlEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(isAuthenticated ? "/dashboard" : "/login");
      };
    }
  });

  // Global click interceptor (attached once)
  if (!(doc.body as any)._hasClarityClickInterceptor) {
    (doc.body as any)._hasClarityClickInterceptor = true;
    doc.body.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (target) {
        const href = target.getAttribute("href") || "";
        const text = target.textContent?.toLowerCase() || "";

        // Route news
        if (href.includes("news") || text.includes("news")) {
          e.preventDefault();
          e.stopPropagation();
          router.push("/news");
          return;
        }

        // Route clinical research
        if (href.includes("clinical-research")) {
          e.preventDefault();
          e.stopPropagation();
          router.push("/clinical-research");
          return;
        }

        // Route Get Started / Download / Dashboard / Auth
        if (
          text.includes("get started") || 
          text.includes("download") || 
          text.includes("dashboard") || 
          text.includes("log in") || 
          text.includes("sign in") ||
          href.includes("/dashboard") ||
          href.includes("download")
        ) {
          e.preventDefault();
          e.stopPropagation();
          router.push(isAuthenticated ? "/dashboard" : "/login");
          return;
        }

        // Suppress external site links / people / about
        if (
          href.startsWith("/people") || 
          href.startsWith("/about") || 
          href.includes("about") || 
          href.includes("talktoash.com") || 
          href.includes("slingshot") ||
          href.includes("instagram") ||
          href.includes("facebook") ||
          href.includes("reddit") ||
          href.includes("x.com") ||
          href.includes("youtube") ||
          href.includes("apple.com")
        ) {
          e.preventDefault();
          e.stopPropagation();
          router.push(isAuthenticated ? "/dashboard" : "/login");
        }
      }
    }, true);
  }
};

const transformIframeContent = (doc: Document, isAuthenticated: boolean, router: AppRouterInstance) => {
  injectCleanStyles(doc);
  applyTextReplacements(doc);
  hideElements(doc);
  hijackActionButtons(doc, isAuthenticated, router);
};

// --- Main Component ---
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    let observer: MutationObserver | null = null;

    const checkAndTransform = () => {
      try {
        const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (doc && doc.readyState === 'complete' && doc.body && doc.body.innerHTML.length > 100) {
          transformIframeContent(doc, isAuthenticated, router);

          // Debounced observer to prevent lag & infinite loops
          if (!observer) {
            let debounceTimer: NodeJS.Timeout;
            let runCount = 0;
            observer = new MutationObserver(() => {
              clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                transformIframeContent(doc, isAuthenticated, router);
                runCount++;
                // Disconnect observer after initial settles to ensure 60fps performance
                if (runCount > 5) {
                  observer?.disconnect();
                }
              }, 400);
            });
            observer.observe(doc.body, { childList: true, subtree: true });
          }
          return true;
        }
      } catch (e) {
        // Ignore
      }
      return false;
    };

    const interval = setInterval(() => {
      if (checkAndTransform()) {
        clearInterval(interval);
      }
    }, 150);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [isAuthenticated, router]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#faf8f5]">
      <iframe
        ref={iframeRef}
        src="/www.talktoash.com/index.html"
        className="w-full h-full border-none opacity-100"
        title="Clarity Landing Page"
      />

      {/* Floating Mood Picker Button */}
      <button 
        onClick={() => setShowMoodPicker(true)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 text-white px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 hover:bg-emerald-700 transition-all flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        How are you feeling?
      </button>

      {/* Mood Picker Modal */}
      <AnimatePresence>
        {showMoodPicker && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-background w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setShowMoodPicker(false)} 
                className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-full flex justify-center bg-card">
                <MoodTracker onMoodLogged={() => router.push('/ai-buddy')} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
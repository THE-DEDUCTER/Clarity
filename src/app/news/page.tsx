"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  Newspaper, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  ChevronRight,
  X,
  ExternalLink,
  Tag
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Clinical AI" | "Research" | "Product Updates" | "Ethics & Safety" | "Community";
  date: string;
  readTime: string;
  badge: string;
  image: string;
  featured?: boolean;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

const NEWS_ARTICLES: NewsItem[] = [
  {
    id: "emotion-responsive-ai-breakthrough",
    title: "Clarity Announces Major Breakthrough in Emotion-Responsive AI for Crisis Prevention",
    subtitle: "New multi-modal sentiment evaluation benchmarks achieve 42% faster response times in detecting acute psychological distress.",
    category: "Clinical AI",
    date: "September 28, 2026",
    readTime: "4 min read",
    badge: "Breaking News",
    featured: true,
    image: "/assets/chatgpt-research.png",
    summary: "Clarity's core AI research team today revealed a landmark milestone in empathetic language modeling, allowing the platform to identify subtle emotional decline before acute crises manifest.",
    content: [
      "Traditional conversational systems often struggle to distinguish between casual frustration and deep psychological distress. By integrating contextual cognitive linguistic analysis with Psychological First Aid (PFA) frameworks, Clarity's updated models detect cognitive distortions and distress markers with unprecedented sensitivity.",
      "The clinical advisory panel confirmed that the protocol achieved a 99.4% precision rate in triggering non-intrusive de-escalation routines and providing grounding exercises before panic episodes peak.",
      "'Our mission has always been prevention and gentle accompaniment,' stated the lead clinical coordinator. 'By understanding the emotional nuance of every word, Clarity can offer breathing cadences and empathetic validation exactly when a person feels most alone.'"
    ],
    keyTakeaways: [
      "Sub-second identification of emotional distress patterns with 99.4% precision.",
      "Immediate, zero-delay activation of grounding routines and compassionate companion guidance.",
      "Zero telemetry leakage with client-side prompt sanitation and end-to-end encryption."
    ]
  },
  {
    id: "clinical-validation-study-anxiety",
    title: "Clinical Validation Study: 87% of Users Report Reduced Daily Anxiety Within 14 Days",
    subtitle: "A randomized pilot trial demonstrates that daily micro-journaling and guided reflection significantly alleviates situational distress.",
    category: "Research",
    date: "September 22, 2026",
    readTime: "5 min read",
    badge: "Clinical Study",
    image: "/framerusercontent.com/images/kQIC9ukuG.LpWpZJA1.png",
    summary: "Independent researchers have validated the therapeutic efficacy of Clarity's daily check-in workflows and emotional streak tracking across diverse participant cohorts.",
    content: [
      "In a 6-week cohort study tracking 1,200 individuals experiencing mild-to-moderate generalized anxiety, participants using Clarity for just 7 minutes daily demonstrated an average 34% drop in GAD-7 anxiety scores.",
      "The combination of structured CBT reflection prompts, mood trend visualization, and the supportive persona proved critical in fostering behavioral consistency and emotional resilience.",
      "Crucially, 87% of participants noted an enhanced sense of emotional self-regulation, citing Clarity's calm, non-judgmental presence as their primary reason for sustained engagement."
    ],
    keyTakeaways: [
      "Statistically significant reduction in GAD-7 anxiety indices over a 14-day window.",
      "Consistent 7-minute daily engagement showed greater retention than traditional therapy homework.",
      "High patient satisfaction across varied age demographics and work stress environments."
    ]
  },
  {
    id: "chakra-art-therapy-suite",
    title: "Clarity Introduces Chakra Art Therapy & Creative Expression Suite",
    subtitle: "Merging ancient mindfulness concepts with digital tactile coloring to help users process complex emotions beyond words.",
    category: "Product Updates",
    date: "September 15, 2026",
    readTime: "3 min read",
    badge: "New Feature",
    image: "/assets/chatgpt-research.png",
    summary: "Recognizing that trauma and deep feelings are often difficult to verbalize, Clarity has launched an interactive tactile canvas featuring sacred geometry and chakra grounding.",
    content: [
      "Words often fall short when processing heavy emotional states. The newly integrated Creative Zone allows users to engage in mindful coloring of sacred chakra mandalas, freehand expressive drawing, and tactile color palette selection.",
      "Art therapy has long been recognized as a potent tool for calming the sympathetic nervous system. Clarity pairs this meditative visual activity with ambient soundscapes and gentle breathing cues.",
      "Users can save their completed artworks directly to their private wellness journals or export high-resolution prints to celebrate their emotional milestones."
    ],
    keyTakeaways: [
      "Interactive SVG tactile color filling for all seven core energetic chakras.",
      "Custom freehand drawing canvas with undo/redo, brush size control, and local high-res export.",
      "Proven to reduce cortisol and heart rate variability within 5 minutes of focused coloring."
    ]
  },
  {
    id: "zero-knowledge-privacy-architecture",
    title: "Zero-Knowledge Architecture: How Clarity Guarantees Complete Mental Health Privacy",
    subtitle: "A detailed look into our client-side encryption protocols that keep your innermost thoughts strictly yours.",
    category: "Ethics & Safety",
    date: "September 08, 2026",
    readTime: "6 min read",
    badge: "Privacy & Trust",
    image: "/assets/chatgpt-research.png",
    summary: "Clarity has introduced a zero-knowledge data architecture ensuring that your conversations, journal entries, and personal assessments are indecipherable even to internal servers.",
    content: [
      "Mental health is sacred and confidential. Unlike corporate wellness tools that monetize user telemetry, Clarity applies military-grade AES-256 encryption at the client layer before any data is synced.",
      "Your personal encryption keys are derived on your device and are never transmitted to our backend. This means neither advertisers, third parties, nor Clarity staff can inspect your journal thoughts.",
      "'Privacy is not a feature; it is an absolute ethical requirement when dealing with human vulnerability,' explained our chief security architect."
    ],
    keyTakeaways: [
      "Full client-side encryption for all chats, diary reflections, and mood assessments.",
      "Strict zero-ad, zero-data-broker policy across the entire ecosystem.",
      "Compliant with global privacy benchmarks and healthcare data standards."
    ]
  },
  {
    id: "university-campus-initiative",
    title: "University Campus Initiative: Providing 24/7 Digital First Aid to 50,000+ Students",
    subtitle: "A nationwide partnership brings accessible, anonymous mental wellness support to students coping with academic pressure.",
    category: "Community",
    date: "August 30, 2026",
    readTime: "4 min read",
    badge: "Impact",
    image: "/framerusercontent.com/images/kQIC9ukuG.LpWpZJA1.png",
    summary: "As student mental health services face unprecedented waitlists, Clarity has partnered with collegiate wellness centers to provide round-the-clock digital psychological support.",
    content: [
      "College counseling centers across the country have reported months-long waiting periods for intake appointments. Clarity bridges this critical gap by providing instant triage, stress de-escalation, and peer support frameworks.",
      "The program empowers students to manage exam anxiety, sleep hygiene, and social burnout through curated micro-exercises and AI-assisted journaling.",
      "University directors report a 53% decrease in crisis escalation during midterms and finals following the deployment of Clarity's on-demand sanctuary."
    ],
    keyTakeaways: [
      "Instantaneous, anonymous support available 24 hours a day without waitlists.",
      "Curated academic stress management and sleep stabilization routines.",
      "Seamless integration with campus health services and emergency counseling lines."
    ]
  },
  {
    id: "global-emergency-helpline-integration",
    title: "Clarity Partners with Emergency Helplines for Instant Crisis Intervention",
    subtitle: "Connecting users in acute crisis directly to verified human responders and emergency safety networks in seconds.",
    category: "Ethics & Safety",
    date: "August 21, 2026",
    readTime: "4 min read",
    badge: "Safety First",
    image: "/assets/chatgpt-research.png",
    summary: "Clarity reinforces its non-negotiable safety commitment by embedding instantaneous warm-handoff protocols for users signaling acute distress or self-harm ideation.",
    content: [
      "While Clarity is a supportive companion for daily mental wellness, our platform is engineered to immediately recognize when human clinical intervention is necessary.",
      "Through verified API integrations with leading global crisis helplines, users expressing urgent distress are provided with direct one-tap calling, encrypted SMS helplines, and localized emergency contacts.",
      "Our AI companion stays with the user during the transition, offering calming grounding prompts until a trained human crisis counselor takes over."
    ],
    keyTakeaways: [
      "Automated detection of acute risk keywords triggering prioritized crisis cards.",
      "One-touch connection to national suicide prevention networks and local emergency hotlines.",
      "Continuous compassionate presence during the handoff process."
    ]
  }
];

export default function NewsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  const categories = ["All", "Clinical AI", "Research", "Product Updates", "Ethics & Safety", "Community"];

  const filteredArticles = NEWS_ARTICLES.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = NEWS_ARTICLES.find(a => a.featured) || NEWS_ARTICLES[0];

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#121118] text-[#262335] dark:text-[#f1e6db] transition-colors">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/85 dark:bg-[#121118]/85 backdrop-blur-md border-b border-[#262335]/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-rose-500" />
              <span className="font-extrabold tracking-tight text-lg">Clarity Newsroom</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
              className="px-5 py-2 rounded-full bg-[#262335] text-white hover:bg-black dark:bg-white dark:text-[#262335] dark:hover:bg-gray-100 font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <span>Get Started</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Newsroom Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Latest Updates & Press</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Advancing Compassionate AI & Digital Mental Health
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            Read the latest announcements, peer-reviewed clinical research findings, ethical data protocols, and product innovations from the Clarity team.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, studies, product updates..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-[#1c1a24] border border-gray-200 dark:border-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all shadow-sm"
            />
          </div>
        </section>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#262335] text-white dark:bg-white dark:text-[#262335] shadow-sm"
                  : "bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Story */}
        {selectedCategory === "All" && !searchQuery && featuredArticle && (
          <section className="bg-white dark:bg-[#1a1824] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                    {featuredArticle.badge}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-rose-500">{featuredArticle.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredArticle.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {featuredArticle.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setActiveArticle(featuredArticle)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors"
                  >
                    <span>Read Full Story</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
                    className="px-4 py-1.5 rounded-full bg-[#262335] text-white hover:bg-black dark:bg-white dark:text-[#262335] font-semibold text-xs transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* News Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">
              {selectedCategory === "All" ? "All Stories & Updates" : `${selectedCategory} News`}
            </h3>
            <span className="text-xs text-muted-foreground">{filteredArticles.length} articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white dark:bg-[#1a1824] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-sm">
                        {article.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-rose-500">{article.category}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>

                    <h4 className="font-bold text-base text-gray-900 dark:text-white leading-snug line-clamp-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800/60 mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{article.readTime}</span>
                  <button
                    onClick={() => setActiveArticle(article)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 space-y-3 bg-white dark:bg-[#1a1824] rounded-2xl border border-gray-200 dark:border-gray-800">
              <Search className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="font-bold text-lg">No articles found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No matching stories found for "{searchQuery}". Try searching for another keyword or select a different category.
              </p>
            </div>
          )}
        </section>

        {/* Bottom Banner */}
        <section className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-teal-500/10 rounded-3xl p-8 sm:p-12 border border-rose-500/20 text-center space-y-4">
          <HeartHandshake className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Begin Your Wellness Journey?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Experience gentle emotional companionship, private encrypted reflections, and evidence-based mental health tools right now.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
              className="px-8 py-3 rounded-full bg-[#262335] text-white hover:bg-black dark:bg-white dark:text-[#262335] font-semibold text-sm transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Modal View for Article Reading */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1a1824] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                    {activeArticle.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-gray-100 dark:border-gray-800 pb-4">
                <span>{activeArticle.date}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
                <span>•</span>
                <span className="text-rose-500 font-semibold">{activeArticle.badge}</span>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {activeArticle.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Key Takeaways */}
              <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/15 space-y-3">
                <h4 className="font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Takeaways
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {activeArticle.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Close Story
                </button>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    router.push(isAuthenticated ? "/dashboard" : "/login");
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#262335] text-white hover:bg-black dark:bg-white dark:text-[#262335] font-semibold text-xs sm:text-sm transition-all shadow-sm"
                >
                  Get Started with Clarity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

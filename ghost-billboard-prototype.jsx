import React, { useState, useMemo, useRef } from "react";

const NOW = Date.now();
const HOUR = 3600 * 1000;

const SEED_STORIES = [
  {
    id: "s1",
    title: "ผีนางรำวัดร้าง ที่คนถ่ายคลิปแล้วป่วยติดกัน 3 คน",
    channel: "ตาสว่างช่อง",
    thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    category: "thai",
    votes: 428,
    createdAt: NOW - 5 * HOUR,
  },
  {
    id: "s2",
    title: "เสียงเคาะประตูตอนตี 3 ทุกคืนเป็นเวลา 1 เดือน (มีคลิปเสียงจริง)",
    channel: "คนเล่าผี",
    thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    category: "real",
    votes: 391,
    createdAt: NOW - 20 * HOUR,
  },
  {
    id: "s3",
    title: "ทรงเจ้าแล้วพูดภาษาที่ไม่มีใครในห้องเข้าใจ",
    channel: "ลึกลับทีวี",
    thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    category: "possession",
    votes: 356,
    createdAt: NOW - 50 * HOUR,
  },
  {
    id: "s4",
    title: "The Doll That Moves Alone — บ้านตุ๊กตาผีในอังกฤษ",
    channel: "Global Horror TH",
    thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    category: "foreign",
    votes: 289,
    createdAt: NOW - 100 * HOUR,
  },
  {
    id: "s5",
    title: "EP.44 หอพักชั้น 4 ที่ไม่มีใครอยู่ได้เกิน 3 เดือน",
    channel: "ผีคุยกันพอดแคสต์",
    thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    category: "podcast",
    votes: 247,
    createdAt: NOW - 170 * HOUR,
  },
  {
    id: "s6",
    title: "กล้องวงจรปิดจับภาพเงาเดินผ่านกำแพงทึบ",
    channel: "ตาสว่างช่อง",
    thumb: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    category: "thai",
    votes: 198,
    createdAt: NOW - 300 * HOUR,
  },
];

function extractYoutubeId(url) {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

// deterministic pseudo-random so embers don't reshuffle on every render
function seeded(i, salt) {
  const x = Math.sin(i * 999 + salt * 37) * 10000;
  return x - Math.floor(x);
}

function Embers({ count = 22 }) {
  const embers = useRef(
    Array.from({ length: count }).map((_, i) => ({
      left: seeded(i, 1) * 100,
      delay: seeded(i, 2) * 8,
      duration: 6 + seeded(i, 3) * 6,
      size: 2 + seeded(i, 4) * 3,
      drift: (seeded(i, 5) - 0.5) * 60,
    }))
  ).current;
  return (
    <div className="embers" aria-hidden="true">
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            "--drift": `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

function GhostEyes({ count = 3 }) {
  const [visible, setVisible] = useState([]);
  React.useEffect(() => {
    const spawn = () => {
      const id = Date.now() + Math.random();
      const spot = {
        id,
        top: 8 + Math.random() * 78,
        left: Math.random() < 0.5 ? 3 + Math.random() * 12 : 78 + Math.random() * 18,
      };
      setVisible((v) => [...v, spot]);
      setTimeout(() => {
        setVisible((v) => v.filter((s) => s.id !== id));
      }, 1800);
    };
    const t = setInterval(spawn, 9000 + Math.random() * 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="ghost-eyes" aria-hidden="true">
      {visible.map((s) => (
        <span key={s.id} className="eye-pair" style={{ top: `${s.top}%`, left: `${s.left}%` }}>
          <span className="eye" /><span className="eye" />
        </span>
      ))}
    </div>
  );
}

function StaticBurst() {
  const [burst, setBurst] = useState(false);
  React.useEffect(() => {
    const t = setInterval(() => {
      setBurst(true);
      setTimeout(() => setBurst(false), 140);
    }, 13000 + Math.random() * 9000);
    return () => clearInterval(t);
  }, []);
  return <div className={`static-burst ${burst ? "static-burst--on" : ""}`} aria-hidden="true" />;
}

function BloodDrips({ count = 6 }) {
  const drips = useRef(
    Array.from({ length: count }).map((_, i) => ({
      left: 4 + seeded(i, 21) * 92,
      length: 40 + seeded(i, 22) * 90,
      delay: seeded(i, 23) * 10,
      duration: 9 + seeded(i, 24) * 7,
    }))
  ).current;
  return (
    <div className="blood-drips" aria-hidden="true">
      {drips.map((d, i) => (
        <span
          key={i}
          className="drip-strand"
          style={{
            left: `${d.left}%`,
            height: d.length,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

const TICKER_MESSAGES = [
  "👻 มีคนเพิ่งโหวตเรื่อง “ผีนางรำวัดร้าง” เมื่อ 8 วินาทีที่แล้ว",
  "💀 กำลังมีคนดูอยู่ตอนนี้ 1,204 คน",
  "🕯️ เรื่องใหม่เพิ่งถูกส่งเข้าชาร์ตเมื่อครู่",
  "👁️ อย่าฟังเรื่องต่อไปนี้คนเดียวตอนดึก...",
];

function TickerBar() {
  const [idx, setIdx] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TICKER_MESSAGES.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="ticker-bar" role="status">
      <span key={idx} className="ticker-text">{TICKER_MESSAGES[idx]}</span>
    </div>
  );
}

function AdSlot({ label, size }) {
  return (
    <div className="ad-slot" role="complementary" aria-label="พื้นที่โฆษณา">
      <span className="ad-slot__tag">โฆษณา</span>
      <span className="ad-slot__label">{label}</span>
      <span className="ad-slot__size">{size}</span>
    </div>
  );
}

const FEATURED_CHANNELS = [
  {
    name: "The Ghost Radio",
    desc: "คลื่นสยองของคนรุ่นใหม่ — ช่องเล่าเรื่องผีที่คนไทยรู้จักกันแทบทุกบ้าน",
  },
  {
    name: "The Shock",
    desc: "ช่องเล่าเรื่องผีสุดสยอง เจ้าของเรื่องดัง “ธี่หยด” ที่ถูกสร้างเป็นหนังฉาย Netflix",
  },
];

function FeaturedChannel() {
  return (
    <div className="featured-channel-row">
      {FEATURED_CHANNELS.map((c) => (
        <div className="featured-channel" key={c.name}>
          <div className="featured-channel__seal">แนะนำ</div>
          <div className="featured-channel__body">
            <p className="featured-channel__name">{c.name}</p>
            <p className="featured-channel__desc">{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AffiliateCard({ item }) {
  return (
    <a className="aff-card" href={item.url} target="_blank" rel="noopener noreferrer sponsored">
      <span className="aff-card__tag">พันธมิตร</span>
      <div className="aff-card__img" style={{ backgroundColor: item.color }}>{item.emoji}</div>
      <p className="aff-card__name">{item.name}</p>
      <p className="aff-card__price">{item.price}</p>
    </a>
  );
}

function AffiliateRow({ title, items }) {
  return (
    <div className="aff-row-wrap">
      <p className="aff-row-title">{title}</p>
      <div className="aff-row">
        {items.map((it) => (
          <AffiliateCard key={it.name} item={it} />
        ))}
      </div>
    </div>
  );
}

function shareUrlFor(id) {
  if (typeof window === "undefined") return "";
  const base = window.location.href.split("#")[0];
  return `${base}#story-${id}`;
}

function ShareRow({ story, rank }) {
  const url = shareUrlFor(story.id);
  const text = `“${story.title}” อันดับ #${rank} บนบิลบอร์ดผี หลอนขนาดนี้ ${story.votes.toLocaleString("th-TH")} โหวตแล้ว`;
  const [copied, setCopied] = useState(false);

  const links = [
    { label: "LINE", href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard unavailable — ignore silently in demo
    }
  };

  return (
    <div className="share-row">
      <span className="share-row__label">แชร์:</span>
      {links.map((l) => (
        <a key={l.label} className="share-btn" href={l.href} target="_blank" rel="noopener noreferrer">
          {l.label}
        </a>
      ))}
      <button className="share-btn share-btn--copy" onClick={copyLink}>
        {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
      </button>
    </div>
  );
}

const REPORT_REASONS = ["ลิงก์เสีย / วิดีโอถูกลบ", "เนื้อหาไม่เหมาะสม", "อื่นๆ"];

function ReportButton({ storyId }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return <span className="report-done">แจ้งแล้ว ขอบคุณ</span>;
  }

  return (
    <div className="report-wrap">
      <button className="report-toggle" onClick={() => setOpen((o) => !o)}>
        🚩 แจ้งปัญหา
      </button>
      {open && (
        <div className="report-menu">
          {REPORT_REASONS.map((r) => (
            <button
              key={r}
              className="report-reason"
              onClick={() => {
                setSent(true);
                setOpen(false);
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LegalModal({ kind, onClose }) {
  if (!kind) return null;
  const content =
    kind === "privacy"
      ? {
          title: "นโยบายความเป็นส่วนตัว",
          body: [
            "เว็บนี้เก็บรหัสอุปกรณ์แบบไม่ระบุตัวตน (device fingerprint) ไว้ในเบราว์เซอร์ของคุณ เพื่อป้องกันการโหวตซ้ำเท่านั้น ไม่เก็บชื่อ อีเมล หรือข้อมูลที่ระบุตัวตนได้ เว้นแต่คุณกรอกเอง เช่น ข้อความในแชท",
            "ข้อมูลโหวตและแชทอาจแสดงต่อผู้ใช้คนอื่นแบบไม่ระบุตัวตน (ใช้ชื่อสุ่ม)",
            "หากต้องการให้ลบข้อมูลที่เกี่ยวข้องกับคุณ ติดต่อได้ที่อีเมลผู้ดูแลเว็บ (ใส่อีเมลจริงก่อนเผยแพร่)",
          ],
        }
      : {
          title: "ข้อตกลงการใช้งาน",
          body: [
            "ห้ามส่งลิงก์ที่มีเนื้อหาผิดกฎหมาย ละเมิดลิขสิทธิ์ หรือไม่เหมาะสม",
            "ทีมงานมีสิทธิ์ลบเรื่องหรือระงับการโหวตที่ผิดปกติ (เช่น ปั่นโหวตด้วยบอท) โดยไม่ต้องแจ้งล่วงหน้า",
            "เนื้อหาทั้งหมดเป็นความคิดเห็น/การจัดอันดับจากผู้ใช้ ไม่ใช่ความเห็นของทีมงาน",
          ],
        };
  return (
    <div className="player-overlay" onClick={onClose}>
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="player-modal__head">
          <p className="player-modal__title">{content.title}</p>
          <button className="player-modal__close" onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        <div className="legal-modal__body">
          {content.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

const AFF_ITEMS_TOP = [
  { name: "หูฟังตัดเสียงรบกวน สำหรับฟังพอดแคสต์ผีตอนดึก", price: "จาก ฿990", emoji: "🎧", color: "#2a1c1f", url: "#" },
  { name: "โคมไฟกลางคืนหรี่แสง กันตื่นกลางดึก", price: "จาก ฿290", emoji: "🕯️", color: "#241a15", url: "#" },
  { name: "เครื่องรางป้องกันภัย ของแท้จากวัดดัง", price: "จาก ฿199", emoji: "🧿", color: "#1d2418", url: "#" },
];

const AFF_ITEMS_MID = [
  { name: "ตั๋วหนังผีรอบดึก ลดสูงสุด 20%", price: "จองเลย", emoji: "🎬", color: "#241518", url: "#" },
  { name: "รวมเรื่องเล่าผีฉบับพิมพ์ ปกแข็ง", price: "จาก ฿245", emoji: "📖", color: "#1c1a14", url: "#" },
];

const AFF_ITEMS_BOTTOM = [
  { name: "กล้องวงจรปิดในบ้าน ดูผ่านมือถือ", price: "จาก ฿1,190", emoji: "📹", color: "#161b22", url: "#" },
  { name: "ธูปหอมสมุนไพร ไล่พลังลบ", price: "จาก ฿79", emoji: "🪔", color: "#231a13", url: "#" },
  { name: "ผ้าห่มหนาพิเศษ อุ่นตอนดูหนังผีดึกๆ", price: "จาก ฿450", emoji: "🛏️", color: "#1a1a24", url: "#" },
];

function RankNumeral({ rank }) {
  const top = rank === 1;
  return (
    <div className={`rank-numeral ${top ? "rank-numeral--first" : rank <= 3 ? "rank-numeral--top3" : ""}`}>
      <span>{rank}</span>
      {top && (
        <svg className="drip" width="40" height="26" viewBox="0 0 40 26" aria-hidden="true">
          <path d="M6 0 Q6 12 3 16 Q0 20 3 24 Q6 27 9 24 Q11 21 9 17 Q7 13 8 0 Z" fill="currentColor" opacity="0.85" />
          <path d="M26 0 Q26 8 24 11 Q22 14 24 17 Q26 19 28 16 Q29 13 27 9 Q26 5 27 0 Z" fill="currentColor" opacity="0.7" />
        </svg>
      )}
    </div>
  );
}

const GHOST_NAMES = [
  "ผีขาเดียว", "วิญญาณเร่ร่อน", "เสียงกระซิบ", "เงาในกระจก", "คนเดินดึก",
  "แม่นาคสาขาสอง", "ผีบ้านร้าง", "เสียงเคาะประตู", "หมาเห่าผี", "ตาเห็นแต่ไม่เชื่อ",
];

function makeNickname() {
  const n = GHOST_NAMES[Math.floor(Math.random() * GHOST_NAMES.length)];
  return `${n}#${Math.floor(100 + Math.random() * 900)}`;
}

const SEED_CHAT_POOL = [
  "ขนลุกตั้งแต่นาทีแรกเลย 😨",
  "เคยเจอเหตุการณ์คล้ายๆ กันเลยตอน ม.ปลาย",
  "อย่าฟังคนเดียวตอนดึกเชียวนะทุกคน",
  "เสียงประกอบทำเอาสะดุ้งเลย",
  "เรื่องนี้ควรได้ที่ 1 จริงๆ",
  "ใครอยู่ก็แชทหน่อย กลัวมากกกก",
];

function PlayerModal({ story, rank, onClose, nickname }) {
  const [viewers, setViewers] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatBodyRef = useRef(null);

  React.useEffect(() => {
    if (!story) return;
    setViewers(700 + Math.floor(Math.random() * 900));
    const seeded = SEED_CHAT_POOL
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((text, i) => ({ id: `seed-${i}`, name: makeNickname(), text }));
    setMessages(seeded);
  }, [story]);

  React.useEffect(() => {
    if (!story) return;
    const t = setInterval(() => {
      setViewers((v) => Math.max(120, v + Math.floor((Math.random() - 0.45) * 40)));
    }, 3000);
    return () => clearInterval(t);
  }, [story]);

  React.useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `me-${Date.now()}`, name: nickname, text, self: true }]);
    setChatInput("");
  };

  if (!story) return null;
  return (
    <div className="player-overlay" onClick={onClose}>
      <div className="player-modal" onClick={(e) => e.stopPropagation()}>
        <div className="player-modal__head">
          <p className="player-modal__title">{story.title}</p>
          <button className="player-modal__close" onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        <div className="player-modal__body">
          <div className="player-modal__video">
            <div className="player-modal__frame">
              <iframe
                src={`https://www.youtube.com/embed/${story.videoId}?autoplay=1&rel=0`}
                title={story.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </div>
            <div className="viewer-bar">
              <span className="viewer-dot" aria-hidden="true" />
              <span>ร่วมฟังพร้อมกัน {viewers.toLocaleString("th-TH")} คน</span>
            </div>
            <div className="modal-actions">
              <ShareRow story={story} rank={rank} />
              <ReportButton storyId={story.id} />
            </div>
          </div>
          <div className="chat-panel">
            <div className="chat-panel__head">แชทระหว่างฟัง</div>
            <div className="chat-panel__body" ref={chatBodyRef}>
              {messages.map((m) => (
                <div key={m.id} className={`chat-msg ${m.self ? "chat-msg--self" : ""}`}>
                  <span className="chat-msg__name">{m.name}</span>
                  <span className="chat-msg__text">{m.text}</span>
                </div>
              ))}
            </div>
            <div className="chat-panel__input-row">
              <input
                className="chat-input"
                type="text"
                placeholder={`คุยในนาม ${nickname}`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                maxLength={200}
              />
              <button className="chat-send" onClick={sendMessage} aria-label="ส่งข้อความ">ส่ง</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story, rank, onVote, voted, featured, tilt, onPlay }) {
  return (
    <div
      className={`story-card ${featured ? "story-card--featured" : ""}`}
      style={{ "--tilt": `${tilt}deg` }}
    >
      <RankNumeral rank={rank} />
      <button className="story-thumb-btn" onClick={() => onPlay(story, rank)} aria-label={`เล่นคลิป ${story.title}`}>
        <img src={story.thumb} alt="" className="story-thumb" loading="lazy" />
        <span className="play-icon">▶</span>
      </button>
      <div className="story-body">
        <p className="story-title">{story.title}</p>
        <p className="story-channel">{story.channel}</p>
      </div>
      <div className="story-vote">
        <button
          className={`vote-btn ${voted ? "vote-btn--voted" : ""}`}
          onClick={() => onVote(story.id)}
          disabled={voted}
          aria-pressed={voted}
        >
          {voted ? "หลอนแล้ว" : "หลอนไหม?"}
        </button>
        <span className="vote-count">{story.votes.toLocaleString("th-TH")}</span>
      </div>
    </div>
  );
}

const RANGE_OPTIONS = [
  { id: "today", label: "วันนี้", ms: 24 * HOUR },
  { id: "week", label: "สัปดาห์นี้", ms: 7 * 24 * HOUR },
  { id: "all", label: "ตลอดกาล", ms: Infinity },
];

export default function GhostBillboard() {
  const [stories, setStories] = useState(SEED_STORIES);
  const [votedIds, setVotedIds] = useState({});
  const [linkInput, setLinkInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [preview, setPreview] = useState(null);
  const [playingStory, setPlayingStory] = useState(null);
  const [playingRank, setPlayingRank] = useState(null);
  const [viewMode, setViewMode] = useState("rank"); // 'rank' | 'latest'
  const [range, setRange] = useState("all");
  const [legalOpen, setLegalOpen] = useState(null); // 'privacy' | 'terms' | null
  const nickname = useRef(makeNickname()).current;

  const openStory = (story, rank) => {
    setPlayingStory(story);
    setPlayingRank(rank);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#story-${story.id}`);
    }
  };

  const closeStory = () => {
    setPlayingStory(null);
    setPlayingRank(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  // deep-link: open the story referenced in the URL hash on load, if any
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const match = hash.match(/^#story-(.+)$/);
    if (match) {
      const target = stories.find((s) => s.id === match[1]);
      if (target) {
        const rank = [...stories].sort((a, b) => b.votes - a.votes).findIndex((s) => s.id === target.id) + 1;
        setPlayingStory(target);
        setPlayingRank(rank);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const rangeMs = RANGE_OPTIONS.find((r) => r.id === range)?.ms ?? Infinity;
    const now = Date.now();
    const inRange =
      viewMode === "latest" || rangeMs === Infinity
        ? stories
        : stories.filter((s) => now - s.createdAt <= rangeMs);
    return viewMode === "latest"
      ? [...stories].sort((a, b) => b.createdAt - a.createdAt)
      : [...inRange].sort((a, b) => b.votes - a.votes);
  }, [stories, viewMode, range]);

  const handleVote = (id) => {
    if (votedIds[id]) return;
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s)));
    setVotedIds((prev) => ({ ...prev, [id]: true }));
  };

  const handleFetchPreview = async () => {
    setFetchError("");
    setPreview(null);
    const videoId = extractYoutubeId(linkInput.trim());
    if (!videoId) {
      setFetchError("วางลิงก์ YouTube ให้ถูกต้อง เช่น https://youtu.be/xxxxxxxxxxx");
      return;
    }
    const existing = stories.find((s) => s.videoId === videoId);
    if (existing) {
      setPreview({
        videoId,
        title: existing.title,
        channel: existing.channel,
        thumb: existing.thumb,
        existingId: existing.id,
      });
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      setPreview({
        videoId,
        title: data.title,
        channel: data.author_name,
        thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      });
    } catch (e) {
      setFetchError("ดึงข้อมูลคลิปไม่สำเร็จ ลองเช็กลิงก์อีกครั้ง");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmitStory = () => {
    if (!preview) return;
    if (preview.existingId) {
      handleVote(preview.existingId);
      setPreview(null);
      setLinkInput("");
      return;
    }
    const newStory = {
      id: `s_${preview.videoId}_${Date.now()}`,
      title: preview.title,
      channel: preview.channel,
      thumb: preview.thumb,
      videoId: preview.videoId,
      category: "real",
      votes: 1,
      createdAt: Date.now(),
    };
    setStories((prev) => [newStory, ...prev]);
    setVotedIds((prev) => ({ ...prev, [newStory.id]: true }));
    setPreview(null);
    setLinkInput("");
  };

  const top10 = filtered.slice(0, 10);
  const top3 = top10.slice(0, 3);
  const rest = top10.slice(3);

  return (
    <div className="gb-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Trirong:ital,wght@0,600;0,700;0,800;1,700&family=Sarabun:wght@400;500;600;700&display=swap');

        :root {
          --bg: #08060a;
          --bg-2: #120a0d;
          --ink: #1a1013;
          --ink-2: #221419;
          --parchment: #e9dcc4;
          --dim: #9c8b7a;
          --blood: #8c1c1c;
          --blood-bright: #c9302c;
          --ember: #e8842e;
          --sick-green: #5c7a4a;
        }

        .gb-root {
          font-family: 'Sarabun', sans-serif;
          background: var(--bg);
          color: var(--parchment);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .gb-root * { box-sizing: border-box; }

        .scanlines {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          opacity: 0.06;
          background: repeating-linear-gradient(
            to bottom,
            #000 0px,
            #000 1px,
            transparent 1px,
            transparent 3px
          );
        }

        .vignette {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background: radial-gradient(ellipse 78% 65% at 50% 30%, transparent 32%, rgba(0,0,0,0.85) 100%);
        }

        .embers {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        .ember {
          position: absolute;
          bottom: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffb066 0%, var(--ember) 55%, transparent 80%);
          box-shadow: 0 0 6px 2px rgba(232,132,46,0.6);
          animation-name: rise;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }
        @keyframes rise {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 0.9; }
          80% { opacity: 0.5; }
          100% { transform: translate(var(--drift), -520px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ember { animation: none; display: none; }
        }

        .hero {
          position: relative;
          padding: 76px 20px 90px;
          text-align: center;
          background:
            radial-gradient(ellipse 70% 55% at 50% 10%, rgba(140,28,28,0.28), transparent 65%),
            radial-gradient(ellipse 50% 40% at 20% 90%, rgba(92,122,74,0.12), transparent 70%),
            var(--bg);
          clip-path: polygon(
            0 0, 100% 0, 100% 92%,
            96% 94%, 90% 91%, 84% 96%, 78% 92%, 72% 97%, 66% 92%,
            60% 96%, 54% 91%, 48% 97%, 42% 92%, 36% 96%, 30% 91%,
            24% 97%, 18% 92%, 12% 96%, 6% 91%, 0 95%
          );
        }

        .hero-eyebrow {
          font-size: 12px;
          letter-spacing: 0.06em;
          color: var(--ember);
          margin-bottom: 16px;
          position: relative;
          z-index: 2;
        }

        .hero-title {
          font-family: 'Trirong', serif;
          font-weight: 800;
          font-size: clamp(52px, 15vw, 96px);
          margin: 0;
          line-height: 0.95;
          letter-spacing: 0.01em;
          color: var(--parchment);
          position: relative;
          z-index: 2;
          transform: rotate(-1.2deg);
          text-shadow:
            3px 3px 0 rgba(140,28,28,0.9),
            6px 6px 0 rgba(0,0,0,0.5),
            0 0 40px rgba(232,132,46,0.35);
        }

        .hero-sub {
          font-size: 15.5px;
          color: var(--dim);
          max-width: 480px;
          margin: 22px auto 34px;
          line-height: 1.7;
          position: relative;
          z-index: 2;
        }

        .submit-row {
          max-width: 580px;
          margin: 0 auto;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .submit-input {
          flex: 1 1 280px;
          background: rgba(20,12,14,0.8);
          border: 1.5px solid #4a2f28;
          color: var(--parchment);
          padding: 15px 18px;
          border-radius: 3px;
          font-size: 14.5px;
          font-family: 'Sarabun', sans-serif;
        }
        .submit-input:focus { outline: 2px solid var(--ember); outline-offset: 1px; }
        .submit-input::placeholder { color: #7a6b58; }

        .submit-btn {
          background: linear-gradient(180deg, var(--blood-bright), var(--blood));
          color: #f5e9dc;
          border: 1.5px solid #e05a3a;
          padding: 15px 26px;
          border-radius: 3px;
          font-family: 'Trirong', serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 0 18px rgba(201,48,44,0.4);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 0 26px rgba(201,48,44,0.6);
        }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
        .submit-btn:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }

        .fetch-error {
          color: #e08a8a;
          font-size: 13px;
          margin-top: 12px;
          position: relative;
          z-index: 2;
        }

        .preview-card {
          max-width: 560px;
          margin: 18px auto 0;
          background: var(--ink);
          border: 1.5px solid #4a2f28;
          border-radius: 4px;
          padding: 12px;
          display: flex;
          gap: 12px;
          align-items: center;
          text-align: left;
          position: relative;
          z-index: 2;
        }
        .preview-thumb { width: 96px; height: 54px; object-fit: cover; border-radius: 2px; flex-shrink: 0; filter: saturate(0.7) contrast(1.1); }
        .preview-title { font-size: 13.5px; line-height: 1.4; margin: 0 0 4px; color: var(--parchment); }
        .preview-channel { font-size: 12px; color: var(--dim); margin: 0; }
        .preview-confirm {
          background: var(--sick-green);
          color: #f0ead9;
          border: 1px solid #7a9a68;
          padding: 10px 18px;
          border-radius: 3px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
        }
        .preview-confirm:hover { filter: brightness(1.2); }
        .preview-confirm--dupe { background: var(--blood); border-color: var(--blood-bright); }
        .preview-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
        .preview-dupe-tag {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #f5e9dc;
          background: var(--blood);
          padding: 2px 7px;
          border-radius: 2px;
          margin-bottom: 5px;
        }

        .category-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 26px 20px 10px;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 2;
        }
        .cat-pill {
          background: rgba(26,16,19,0.7);
          border: 1px solid #3a2a24;
          color: var(--dim);
          padding: 8px 18px;
          border-radius: 2px;
          font-size: 13px;
          font-family: 'Sarabun', sans-serif;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
          position: relative;
        }
        .cat-pill:hover { border-color: var(--ember); color: var(--parchment); }
        .cat-pill--active {
          background: var(--blood);
          border-color: var(--blood-bright);
          color: #f5e9dc;
          font-weight: 700;
          box-shadow: 0 0 14px rgba(140,28,28,0.5);
        }

        .chart-section {
          max-width: 720px;
          margin: 0 auto;
          padding: 10px 18px 70px;
          position: relative;
          z-index: 2;
        }

        .section-label {
          font-family: 'Trirong', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--ember);
          margin: 34px 0 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, #4a2f28, transparent);
        }

        .story-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--ink);
          border: 1px solid #2e2019;
          border-radius: 3px;
          padding: 12px 16px;
          margin-bottom: 12px;
          position: relative;
          transform: rotate(var(--tilt, 0deg));
          box-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        .story-card--featured {
          padding: 18px;
          background: linear-gradient(135deg, var(--ink-2), var(--ink));
          border-color: #4a2f28;
        }

        .rank-numeral {
          font-family: 'Trirong', serif;
          font-weight: 800;
          font-size: 26px;
          color: #6b5b48;
          min-width: 40px;
          text-align: center;
          flex-shrink: 0;
          position: relative;
        }
        .rank-numeral--top3 {
          font-size: 36px;
          color: var(--ember);
          text-shadow: 0 0 14px rgba(232,132,46,0.6);
        }
        .rank-numeral--first {
          font-size: 52px;
          color: #ff9d4d;
          text-shadow:
            0 0 10px rgba(255,157,77,0.9),
            0 0 30px rgba(201,48,44,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .rank-numeral .drip { color: var(--blood-bright); margin-top: -8px; }

        .story-thumb {
          width: 90px;
          height: 50px;
          object-fit: cover;
          border-radius: 2px;
          flex-shrink: 0;
          filter: saturate(0.65) contrast(1.15) brightness(0.9);
        }
        .story-card--featured .story-thumb { width: 124px; height: 70px; }

        .story-body { flex: 1; min-width: 0; }
        .story-title {
          font-size: 14px;
          line-height: 1.45;
          margin: 0 0 5px;
          color: var(--parchment);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .story-card--featured .story-title { font-size: 16px; font-weight: 500; }
        .story-channel { font-size: 12px; color: var(--dim); margin: 0; }

        .story-vote { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; }
        .vote-btn {
          background: transparent;
          border: 1.5px solid var(--blood-bright);
          color: #e8a0a0;
          padding: 7px 14px;
          border-radius: 3px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Sarabun', sans-serif;
        }
        .vote-btn:hover:not(:disabled) {
          background: var(--blood-bright);
          color: #fff;
          box-shadow: 0 0 12px rgba(201,48,44,0.6);
        }
        .vote-btn--voted {
          background: var(--sick-green);
          border-color: #7a9a68;
          color: #f0ead9;
          cursor: default;
        }
        .vote-btn:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }
        .vote-count { font-size: 12px; color: var(--dim); font-variant-numeric: tabular-nums; }

        /* ghost eyes */
        .ghost-eyes {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }
        .eye-pair {
          position: absolute;
          display: flex;
          gap: 10px;
          animation: eye-fade 1.8s ease-in-out;
        }
        .eye {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffe9c2 0%, var(--ember) 60%, transparent 100%);
          box-shadow: 0 0 8px 3px rgba(232,132,46,0.8);
        }
        @keyframes eye-fade {
          0% { opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ghost-eyes { display: none; }
        }

        /* static burst */
        .static-burst {
          position: fixed;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          opacity: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          transition: opacity 0.05s linear;
        }
        .static-burst--on { opacity: 0.35; }
        @media (prefers-reduced-motion: reduce) {
          .static-burst { display: none; }
        }

        .empty-state { text-align: center; color: var(--dim); font-size: 13px; padding: 50px 20px; }

        /* screen flicker */
        .flicker-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 7;
          background: #000;
          opacity: 0;
          animation: flicker-screen 7s infinite steps(1);
        }
        @keyframes flicker-screen {
          0%, 91%, 93%, 96%, 100% { opacity: 0; background: #000; }
          92% { opacity: 0.1; background: #fff; }
          94% { opacity: 0.15; background: #000; }
          95% { opacity: 0.05; background: #fff; }
        }
        @media (prefers-reduced-motion: reduce) {
          .flicker-overlay { animation: none; display: none; }
        }

        /* glitch title */
        .hero-title {
          animation: title-jitter 6.5s infinite;
        }
        @keyframes title-jitter {
          0%, 96%, 100% { transform: rotate(-1.2deg) translate(0,0); }
          97% { transform: rotate(-1.2deg) translate(-2px, 1px); text-shadow: -2px 0 var(--sick-green), 2px 0 var(--blood-bright), 3px 3px 0 rgba(140,28,28,0.9), 6px 6px 0 rgba(0,0,0,0.5); }
          98% { transform: rotate(-0.6deg) translate(2px, -1px); }
          99% { transform: rotate(-1.2deg) translate(0,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-title { animation: none; }
        }

        /* blood drips */
        .blood-drips {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 0;
          z-index: 1;
          pointer-events: none;
        }
        .drip-strand {
          position: absolute;
          top: -20px;
          width: 3px;
          background: linear-gradient(to bottom, var(--blood-bright), var(--blood) 70%, transparent);
          border-radius: 0 0 3px 3px;
          animation-name: drip-fall;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          opacity: 0.85;
        }
        .drip-strand::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: -1.5px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--blood-bright);
        }
        @keyframes drip-fall {
          0% { transform: translateY(0); opacity: 0.9; }
          85% { opacity: 0.7; }
          100% { transform: translateY(38px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .drip-strand { animation: none; opacity: 0.4; }
        }

        /* ticker */
        .ticker-bar {
          background: #0d0708;
          border-top: 1px solid #2e2019;
          border-bottom: 1px solid #2e2019;
          padding: 9px 16px;
          text-align: center;
          overflow: hidden;
          position: relative;
          z-index: 2;
        }
        .ticker-text {
          font-size: 12.5px;
          color: var(--dim);
          display: inline-block;
          animation: ticker-fade 0.5s ease;
        }
        @keyframes ticker-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ad slots */
        .ad-slot-wrap {
          display: flex;
          justify-content: center;
          padding: 22px 20px 0;
          position: relative;
          z-index: 2;
        }
        .ad-slot {
          width: 100%;
          max-width: 640px;
          border: 1.5px dashed #4a3a30;
          background: repeating-linear-gradient(135deg, rgba(140,28,28,0.05), rgba(140,28,28,0.05) 10px, transparent 10px, transparent 20px);
          border-radius: 3px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          color: var(--dim);
          margin: 14px 0;
        }
        .ad-slot__tag {
          font-family: 'Trirong', serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          background: var(--blood);
          color: #f5e9dc;
          padding: 3px 9px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .ad-slot__label { font-size: 12.5px; color: var(--parchment); }
        .ad-slot__size { font-size: 11px; color: var(--dim); margin-left: auto; }

        /* featured channel */
        .featured-channel-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .featured-channel {
          flex: 1 1 260px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, var(--ink-2), var(--ink));
          border: 1px solid var(--blood);
          border-radius: 4px;
          padding: 16px;
          box-shadow: 0 0 20px rgba(140,28,28,0.25);
        }
        .featured-channel__seal {
          font-family: 'Trirong', serif;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: #f5e9dc;
          background: radial-gradient(circle, var(--blood-bright), var(--blood));
          border-radius: 50%;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex-shrink: 0;
          transform: rotate(-8deg);
          box-shadow: 0 0 14px rgba(201,48,44,0.5);
        }
        .featured-channel__name {
          font-family: 'Trirong', serif;
          font-weight: 700;
          font-size: 17px;
          margin: 0 0 4px;
          color: var(--parchment);
        }
        .featured-channel__desc {
          font-size: 12.5px;
          color: var(--dim);
          margin: 0;
          line-height: 1.5;
        }
        .story-thumb-btn {
          position: relative;
          border: none;
          padding: 0;
          background: none;
          cursor: pointer;
          flex-shrink: 0;
          border-radius: 2px;
          overflow: hidden;
        }
        .story-thumb-btn:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }
        .play-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(8,6,10,0.25);
          color: #f5e9dc;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.15s ease, background 0.15s ease;
        }
        .story-thumb-btn:hover .play-icon,
        .story-thumb-btn:focus-visible .play-icon {
          opacity: 1;
          background: rgba(8,6,10,0.5);
        }

        .player-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4,2,3,0.88);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .player-modal {
          width: 100%;
          max-width: 920px;
          background: var(--ink);
          border: 1.5px solid var(--blood);
          border-radius: 4px;
          box-shadow: 0 0 40px rgba(140,28,28,0.4);
          overflow: hidden;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .player-modal__head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid #2e2019;
          flex-shrink: 0;
        }
        .player-modal__title {
          font-size: 13px;
          color: var(--parchment);
          margin: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .player-modal__close {
          background: var(--blood);
          color: #f5e9dc;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 13px;
          flex-shrink: 0;
        }
        .player-modal__close:hover { background: var(--blood-bright); }
        .player-modal__close:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }

        .player-modal__body {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        @media (min-width: 720px) {
          .player-modal__body { flex-direction: row; }
          .player-modal__video { flex: 1 1 60%; min-width: 0; }
          .chat-panel { flex: 1 1 40%; max-width: 320px; border-top: none; border-left: 1px solid #2e2019; }
        }

        .player-modal__frame {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
        }
        .player-modal__frame iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .viewer-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          font-size: 12px;
          color: var(--dim);
          background: #0d0708;
        }
        .viewer-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4caf50;
          box-shadow: 0 0 6px 1px rgba(76,175,80,0.7);
          animation: pulse-dot 1.6s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .viewer-dot { animation: none; }
        }

        .chat-panel {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #2e2019;
          min-height: 260px;
          max-height: 260px;
        }
        @media (min-width: 720px) {
          .chat-panel { min-height: 0; max-height: none; }
        }
        .chat-panel__head {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--dim);
          padding: 9px 12px;
          border-bottom: 1px solid #2e2019;
          flex-shrink: 0;
        }
        .chat-panel__body {
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .chat-msg { font-size: 12.5px; line-height: 1.5; }
        .chat-msg__name {
          color: var(--ember);
          font-weight: 600;
          margin-right: 6px;
        }
        .chat-msg--self .chat-msg__name { color: var(--sick-green); }
        .chat-msg__text { color: var(--parchment); word-break: break-word; }
        .chat-panel__input-row {
          display: flex;
          gap: 6px;
          padding: 10px 12px;
          border-top: 1px solid #2e2019;
          flex-shrink: 0;
        }
        .chat-input {
          flex: 1;
          background: rgba(20,12,14,0.8);
          border: 1px solid #4a2f28;
          color: var(--parchment);
          padding: 8px 10px;
          border-radius: 3px;
          font-size: 12.5px;
          font-family: 'Sarabun', sans-serif;
          min-width: 0;
        }
        .chat-input:focus { outline: 2px solid var(--ember); outline-offset: 1px; }
        .chat-send {
          background: var(--blood);
          color: #f5e9dc;
          border: none;
          padding: 8px 14px;
          border-radius: 3px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
        }
        .chat-send:hover { background: var(--blood-bright); }
        .chat-send:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }

        /* affiliate */
        .aff-row-wrap {
          max-width: 640px;
          margin: 18px auto 0;
          position: relative;
          z-index: 2;
        }
        .aff-row-title {
          font-size: 11.5px;
          letter-spacing: 0.1em;
          color: var(--dim);
          text-align: left;
          margin: 0 0 8px;
        }
        .aff-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .aff-card {
          flex: 0 0 148px;
          background: var(--ink);
          border: 1px solid #2e2019;
          border-radius: 4px;
          padding: 10px;
          text-decoration: none;
          position: relative;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .aff-card:hover { border-color: var(--ember); transform: translateY(-2px); }
        .aff-card:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }
        .aff-card__tag {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 9px;
          letter-spacing: 0.06em;
          color: var(--dim);
          background: rgba(0,0,0,0.5);
          padding: 2px 6px;
          border-radius: 2px;
        }
        .aff-card__img {
          width: 100%;
          height: 64px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 8px;
        }
        .aff-card__name {
          font-size: 11.5px;
          line-height: 1.4;
          color: var(--parchment);
          margin: 0 0 4px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .aff-card__price {
          font-size: 11px;
          color: var(--ember);
          font-weight: 600;
          margin: 0;
        }

        /* tip.me floating button */
        .tip-fab {
          position: fixed;
          bottom: 18px;
          right: 18px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(180deg, var(--blood-bright), var(--blood));
          color: #f5e9dc;
          text-decoration: none;
          padding: 11px 16px 11px 12px;
          border-radius: 999px;
          border: 1.5px solid #e05a3a;
          box-shadow: 0 4px 18px rgba(0,0,0,0.5), 0 0 16px rgba(201,48,44,0.35);
          font-size: 13px;
          font-weight: 600;
          font-family: 'Sarabun', sans-serif;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .tip-fab:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(0,0,0,0.55), 0 0 22px rgba(201,48,44,0.5);
        }
        .tip-fab:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }
        .tip-fab__icon { font-size: 16px; }
        @media (max-width: 420px) {
          .tip-fab__text { display: none; }
          .tip-fab { padding: 11px; }
        }

        /* mode + range tabs */
        .mode-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }
        .mode-tab {
          background: transparent;
          border: 1px solid #3a2a24;
          color: var(--dim);
          padding: 8px 16px;
          border-radius: 3px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .mode-tab--active {
          background: var(--blood);
          border-color: var(--blood-bright);
          color: #f5e9dc;
        }
        .range-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 18px;
        }
        .range-tab {
          background: rgba(26,16,19,0.7);
          border: 1px solid #2e2019;
          color: var(--dim);
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          cursor: pointer;
        }
        .range-tab--active {
          border-color: var(--ember);
          color: var(--ember);
        }

        /* share row */
        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding: 9px 12px;
          background: #0d0708;
        }
        .share-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .share-row__label { font-size: 11.5px; color: var(--dim); }
        .share-btn {
          font-size: 11.5px;
          color: var(--parchment);
          background: rgba(255,255,255,0.06);
          border: 1px solid #3a2a24;
          padding: 5px 10px;
          border-radius: 3px;
          text-decoration: none;
          cursor: pointer;
        }
        .share-btn:hover { border-color: var(--ember); }
        .share-btn--copy { font-family: 'Sarabun', sans-serif; }

        /* report */
        .report-wrap { position: relative; }
        .report-toggle {
          background: transparent;
          border: 1px solid #3a2a24;
          color: var(--dim);
          font-size: 11.5px;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }
        .report-toggle:hover { border-color: var(--blood-bright); color: #e08a8a; }
        .report-done { font-size: 11.5px; color: var(--sick-green); }
        .report-menu {
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 6px;
          background: var(--ink);
          border: 1px solid var(--blood);
          border-radius: 4px;
          overflow: hidden;
          min-width: 170px;
          z-index: 20;
        }
        .report-reason {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          color: var(--parchment);
          font-size: 12px;
          padding: 9px 12px;
          cursor: pointer;
          font-family: 'Sarabun', sans-serif;
        }
        .report-reason:hover { background: var(--blood); }

        /* footer + legal modal */
        .site-footer {
          text-align: center;
          padding: 30px 0 10px;
          font-size: 12px;
        }
        .footer-link {
          background: none;
          border: none;
          color: var(--dim);
          font-size: 12px;
          text-decoration: underline;
          cursor: pointer;
          font-family: 'Sarabun', sans-serif;
        }
        .footer-link:hover { color: var(--ember); }
        .footer-dot { color: var(--dim); margin: 0 8px; }

        .legal-modal {
          width: 100%;
          max-width: 520px;
          max-height: 80vh;
          background: var(--ink);
          border: 1.5px solid var(--blood);
          border-radius: 4px;
          overflow-y: auto;
          box-shadow: 0 0 40px rgba(140,28,28,0.4);
        }
        .legal-modal__body {
          padding: 16px;
          font-size: 13px;
          line-height: 1.7;
          color: var(--dim);
        }
        .legal-modal__body p { margin: 0 0 12px; }
      `}</style>

      <div className="vignette" />
      <div className="scanlines" />
      <div className="flicker-overlay" aria-hidden="true" />
      <GhostEyes />
      <StaticBurst />

      <header className="hero">
        <BloodDrips />
        <Embers />
        <p className="hero-eyebrow">จัดอันดับเรื่องผีที่หลอนที่สุดในไทย</p>
        <h1 className="hero-title">บิลบอร์ดผี</h1>
        <p className="hero-sub">
          วางลิงก์ YouTube เรื่องผีที่คุณว่าหลอนที่สุด แล้วให้ทุกคนช่วยโหวต
          จัดอันดับกันแบบเรียลไทม์ — ยิ่งหลอน ยิ่งไต่อันดับเร็ว
        </p>

        <div className="submit-row">
          <input
            className="submit-input"
            type="text"
            placeholder="วางลิงก์ YouTube ตรงนี้..."
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetchPreview()}
          />
          <button className="submit-btn" onClick={handleFetchPreview} disabled={fetching || !linkInput.trim()}>
            {fetching ? "กำลังปลุกวิญญาณ..." : "ดูตัวอย่าง"}
          </button>
        </div>

        {fetchError && <p className="fetch-error">{fetchError}</p>}

        {preview && (
          <div className="preview-card">
            <img src={preview.thumb} alt="" className="preview-thumb" />
            <div style={{ flex: 1, minWidth: 0 }}>
              {preview.existingId && <span className="preview-dupe-tag">มีอยู่ในชาร์ตแล้ว</span>}
              <p className="preview-title">{preview.title}</p>
              <p className="preview-channel">{preview.channel}</p>
            </div>
            <button
              className={`preview-confirm ${preview.existingId ? "preview-confirm--dupe" : ""}`}
              onClick={handleSubmitStory}
              disabled={preview.existingId && votedIds[preview.existingId]}
            >
              {preview.existingId
                ? votedIds[preview.existingId] ? "โหวตแล้ว" : "โหวตให้เรื่องนี้แทน"
                : "ส่งเข้าชาร์ต"}
            </button>
          </div>
        )}

        <AffiliateRow title="สินค้าแนวเดียวกับที่แฟนคลับ The Ghost Radio ชอบ" items={AFF_ITEMS_TOP} />
      </header>

      <TickerBar />

      <div className="ad-slot-wrap">
        <AdSlot label="พื้นที่โฆษณาแบนเนอร์" size="728 × 90" />
      </div>

      <div className="chart-section" style={{ paddingBottom: 0, paddingTop: 24 }}>
        <FeaturedChannel />
      </div>

      <main className="chart-section">
        <div className="mode-tabs">
          <button
            className={`mode-tab ${viewMode === "rank" ? "mode-tab--active" : ""}`}
            onClick={() => setViewMode("rank")}
          >
            หลอนที่สุด
          </button>
          <button
            className={`mode-tab ${viewMode === "latest" ? "mode-tab--active" : ""}`}
            onClick={() => setViewMode("latest")}
          >
            ล่าสุด
          </button>
        </div>
        {viewMode === "rank" && (
          <div className="range-tabs">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r.id}
                className={`range-tab ${range === r.id ? "range-tab--active" : ""}`}
                onClick={() => setRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="empty-state">ยังไม่มีเรื่องในชาร์ต เป็นคนแรกที่ปลุกมันขึ้นมาสิ</p>
        ) : (
          <>
            <p className="section-label">{viewMode === "latest" ? "ส่งเข้ามาล่าสุด" : "TOP 10 หลอนที่สุด"}</p>
            {top3.map((s, i) => (
              <StoryCard
                key={s.id}
                story={s}
                rank={i + 1}
                onVote={handleVote}
                voted={!!votedIds[s.id]}
                featured
                tilt={(seeded(i, 9) - 0.5) * 1.4}
                onPlay={openStory}
              />
            ))}
            <AdSlot label="พื้นที่โฆษณาในฟีด" size="Native · 1:1" />
            <AffiliateRow title="แนะนำสำหรับคืนนี้" items={AFF_ITEMS_MID} />

            {rest.length > 0 && (
              <>
                <p className="section-label">อันดับ 4-10</p>
                {rest.map((s, i) => (
                  <StoryCard
                    key={s.id}
                    story={s}
                    rank={i + 4}
                    onVote={handleVote}
                    voted={!!votedIds[s.id]}
                    tilt={(seeded(i + 10, 9) - 0.5) * 1.2}
                    onPlay={openStory}
                  />
                ))}
              </>
            )}
            <AdSlot label="พื้นที่โฆษณาท้ายหน้า" size="300 × 250" />
            <AffiliateRow title="เตรียมตัวก่อนนอน" items={AFF_ITEMS_BOTTOM} />
          </>
        )}

        <footer className="site-footer">
          <button className="footer-link" onClick={() => setLegalOpen("privacy")}>นโยบายความเป็นส่วนตัว</button>
          <span className="footer-dot">·</span>
          <button className="footer-link" onClick={() => setLegalOpen("terms")}>ข้อตกลงการใช้งาน</button>
        </footer>
      </main>
      <PlayerModal story={playingStory} rank={playingRank} onClose={closeStory} nickname={nickname} />
      <LegalModal kind={legalOpen} onClose={() => setLegalOpen(null)} />

      <a
        className="tip-fab"
        href="https://tip.me/YOUR_USERNAME"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="เลี้ยงกาแฟแอดมินผ่าน tip.me"
      >
        <span className="tip-fab__icon">☕</span>
        <span className="tip-fab__text">เลี้ยงกาแฟแอดมิน</span>
      </a>
    </div>
  );
}

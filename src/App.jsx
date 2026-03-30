import { useState, useRef, useCallback, useMemo } from "react";
import {
  Bookmark, BookmarkCheck, X, Search, SlidersHorizontal,
  MapPin, Calendar, DollarSign, Users, Clock,
  ExternalLink, Home, ArrowLeft, Flag,
} from "lucide-react";

const T = {
  green:     "#1B4332",
  greenMid:  "#2D6A4F",
  greenLight:"#D8F3DC",
  cream:     "#F8F4EE",
  gold:      "#A67C35",
  goldLight: "#F5ECD7",
  black:     "#1C1C1E",
  gray:      "#6B7280",
  grayLight: "#9CA3AF",
  lineGray:  "#D1CFC9",
  bgGray:    "#F0EFEB",
  white:     "#FFFFFF",
  error:     "#B91C1C",
  success:   "#166534",
};

const serif = "Georgia, 'Times New Roman', serif";
const sans  = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

const TOURNAMENTS = [
  {
    id: 1,
    name: "Tulsa County Bar Classic",
    date: "2026-04-11",
    time: "8:00 AM",
    course: "Cedar Ridge Country Club",
    city: "Broken Arrow",
    price: 125,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Tulsa County Bar Association",
    isCharity: true,
    tags: ["Mulligans", "Prizes", "Lunch Included", "Raffle"],
    notes: "Includes lunch, two mulligans per player, and awards reception following play.",
  },
  {
    id: 2,
    name: "Route 66 Charity Scramble",
    date: "2026-04-18",
    time: "7:30 AM",
    course: "Mohawk Park Golf Course",
    city: "Tulsa",
    price: 75,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Route 66 Historical Society",
    isCharity: true,
    tags: ["Skins", "Mulligans", "Food Included", "Closest to Pin"],
    notes: "All proceeds benefit Route 66 preservation. Breakfast and lunch provided.",
  },
  {
    id: 3,
    name: "BOK Financial Invitational",
    date: "2026-04-25",
    time: "12:00 PM",
    course: "Southern Hills Country Club",
    city: "Tulsa",
    price: 175,
    format: "Captain's Choice",
    singlesWelcome: false,
    startFormat: "Shotgun",
    host: "BOK Financial",
    isCharity: false,
    tags: ["Prizes", "Longest Drive", "Closest to Pin", "Dinner Included"],
    notes: "Corporate invitational. Teams must be pre-registered.",
  },
  {
    id: 4,
    name: "Saint Francis Hospital Benefit",
    date: "2026-05-02",
    time: "8:00 AM",
    course: "LaFortune Park Golf Course",
    city: "Tulsa",
    price: 85,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Saint Francis Health System",
    isCharity: true,
    tags: ["Mulligans", "Raffle", "Food Included", "Handicaps"],
    notes: "Supporting pediatric care programs. Breakfast provided.",
  },
  {
    id: 5,
    name: "Roughnecks FC Golf Classic",
    date: "2026-05-09",
    time: "1:00 PM",
    course: "Page Belcher Golf Course",
    city: "Tulsa",
    price: 100,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Tee Times",
    host: "FC Tulsa Foundation",
    isCharity: true,
    tags: ["Prizes", "Skins", "Closest to Pin", "Longest Drive"],
    notes: "Meet current FC Tulsa players. Free season ticket vouchers for all.",
  },
  {
    id: 6,
    name: "Jenks Education Scramble",
    date: "2026-05-16",
    time: "8:00 AM",
    course: "South Lakes Golf Course",
    city: "Jenks",
    price: 90,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Jenks Public Schools Foundation",
    isCharity: true,
    tags: ["Mulligans", "Raffle", "Lunch Included", "Net Scoring"],
    notes: "Supports STEM programs. Lunch and two drink tickets included.",
  },
  {
    id: 7,
    name: "Owasso Firefighters Scramble",
    date: "2026-05-23",
    time: "7:30 AM",
    course: "Bailey Ranch Golf Club",
    city: "Owasso",
    price: 80,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Owasso Professional Firefighters",
    isCharity: true,
    tags: ["Food Included", "Mulligans", "Prizes", "Closest to Pin"],
    notes: "Supporting families of injured firefighters. Fire truck photo ops.",
  },
  {
    id: 8,
    name: "Battle of the Banks Scramble",
    date: "2026-05-30",
    time: "12:30 PM",
    course: "Forest Ridge Golf Club",
    city: "Broken Arrow",
    price: 150,
    format: "Captain's Choice",
    singlesWelcome: false,
    startFormat: "Shotgun",
    host: "Tulsa Banking Association",
    isCharity: false,
    tags: ["Prizes", "Longest Drive", "Skins", "Dinner Included"],
    notes: "Inter-bank competition. Pre-formed teams only.",
  },
  {
    id: 9,
    name: "Veterans Honor Scramble",
    date: "2026-06-06",
    time: "8:00 AM",
    course: "Tulsa Country Club",
    city: "Tulsa",
    price: 110,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Oklahoma Veterans Coalition",
    isCharity: true,
    tags: ["Mulligans", "Raffle", "Prizes", "Lunch Included", "Handicaps"],
    notes: "Honoring Oklahoma veterans. Active and retired military play free.",
  },
  {
    id: 10,
    name: "Muscogee Creek Nation Classic",
    date: "2026-06-13",
    time: "9:00 AM",
    course: "Muscogee Creek Nation Golf Course",
    city: "Okmulgee",
    price: 65,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Muscogee Creek Nation",
    isCharity: true,
    tags: ["Food Included", "Prizes", "Closest to Pin", "Mulligans"],
    notes: "Supporting tribal youth programs. Traditional meal following play.",
  },
  {
    id: 11,
    name: "Junior Achievement Scramble",
    date: "2026-06-20",
    time: "7:30 AM",
    course: "The Canyons at Blackjack Ridge",
    city: "Catoosa",
    price: 95,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Junior Achievement of Oklahoma",
    isCharity: true,
    tags: ["Mulligans", "Raffle", "Lunch Included", "Skins"],
    notes: "Teaching kids business skills. Hole sponsors welcome.",
  },
  {
    id: 12,
    name: "BA Chamber Scramble",
    date: "2026-06-27",
    time: "1:00 PM",
    course: "Battle Creek Golf Club",
    city: "Broken Arrow",
    price: 120,
    format: "4-Person Scramble",
    singlesWelcome: false,
    startFormat: "Tee Times",
    host: "Broken Arrow Chamber of Commerce",
    isCharity: false,
    tags: ["Prizes", "Longest Drive", "Closest to Pin", "Dinner Included"],
    notes: "Annual networking event. Teams must be pre-registered.",
  },
  {
    id: 13,
    name: "Oklahoma Cattlemen's Scramble",
    date: "2026-07-04",
    time: "8:00 AM",
    course: "Meadowbrook Country Club",
    city: "Tulsa",
    price: 100,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Oklahoma Cattlemen's Association",
    isCharity: true,
    tags: ["Food Included", "Mulligans", "Prizes", "Raffle", "Longest Drive"],
    notes: "July 4th tradition. Oklahoma beef lunch included.",
  },
  {
    id: 14,
    name: "SPCA Paws & Clubs Classic",
    date: "2026-07-11",
    time: "8:30 AM",
    course: "Oaks Country Club",
    city: "Tulsa",
    price: 95,
    format: "4-Person Scramble",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Tulsa SPCA",
    isCharity: true,
    tags: ["Mulligans", "Raffle", "Prizes", "Closest to Pin", "Food Included"],
    notes: "Supporting animal rescue. Pet adoption booth at clubhouse.",
  },
  {
    id: 15,
    name: "Downtown Rotary Scramble",
    date: "2026-07-18",
    time: "12:00 PM",
    course: "White Hawk Golf Club",
    city: "Bixby",
    price: 110,
    format: "Captain's Choice",
    singlesWelcome: true,
    startFormat: "Shotgun",
    host: "Tulsa Downtown Rotary Club",
    isCharity: true,
    tags: ["Mulligans", "Skins", "Prizes", "Lunch Included", "Net Scoring"],
    notes: "Supporting literacy programs. New golfers especially welcome.",
  },
];

const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};
const formatDateLong = (dateStr) => {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};
const formatPrice = (p) => p === 0 ? "Free" : `$${p}`;

const ALL_TAGS = [...new Set(TOURNAMENTS.flatMap(t => t.tags))].sort();

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [zip, setZip] = useState("");

  if (step === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: 40, textAlign: "center", background: T.cream,
      }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: T.green, display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <Flag size={36} color={T.white} />
          </div>
          <h1 style={{
            fontFamily: serif, fontSize: 36, fontWeight: 700,
            color: T.green, margin: 0, lineHeight: 1.2,
          }}>
            Scramble
          </h1>
          <p style={{
            fontSize: 14, color: T.gray, marginTop: 4,
            fontFamily: sans, letterSpacing: 2, textTransform: "uppercase",
          }}>
            Golf Tournament Discovery
          </p>
        </div>
        <p style={{
          fontSize: 18, color: T.black, lineHeight: 1.6,
          maxWidth: 280, margin: "0 auto 48px",
        }}>
          Find local scramble tournaments, save the ones you like, and register in seconds.
        </p>
        <button
          onClick={() => setStep(1)}
          style={{
            background: T.green, color: T.white,
            border: "none", borderRadius: 14, padding: "16px 48px",
            fontSize: 17, fontWeight: 600, cursor: "pointer",
            fontFamily: sans, letterSpacing: 0.3,
          }}
        >
          Find Scrambles Near You
        </button>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      padding: 40, textAlign: "center", background: T.cream,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: T.greenLight, display: "flex",
        alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
      }}>
        <MapPin size={28} color={T.green} />
      </div>
      <h2 style={{
        fontFamily: serif, fontSize: 26, fontWeight: 700,
        color: T.black, margin: "0 0 8px",
      }}>
        Where do you play?
      </h2>
      <p style={{
        fontSize: 15, color: T.gray, margin: "0 0 32px",
        maxWidth: 260, lineHeight: 1.5,
      }}>
        We use your location to show scrambles nearby — nothing else.
      </p>
      <button
        onClick={() => onComplete("Tulsa, OK")}
        style={{
          background: T.green, color: T.white,
          border: "none", borderRadius: 14, padding: "16px 48px",
          fontSize: 17, fontWeight: 600, cursor: "pointer",
          fontFamily: sans, width: "100%", maxWidth: 300,
          marginBottom: 16,
        }}
      >
        Use My Location
      </button>
      <div style={{ width: "100%", maxWidth: 300 }}>
        <p style={{ fontSize: 14, color: T.gray, margin: "16px 0 10px" }}>
          Or enter your ZIP code
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="74101"
            value={zip}
            onChange={e => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
            style={{
              flex: 1, padding: "14px 16px", borderRadius: 12,
              border: `1.5px solid ${T.lineGray}`, fontSize: 17,
              fontFamily: sans, background: T.white,
              outline: "none", textAlign: "center", letterSpacing: 4,
            }}
          />
          <button
            onClick={() => zip.length === 5 && onComplete(`ZIP ${zip}`)}
            disabled={zip.length < 5}
            style={{
              background: zip.length === 5 ? T.green : T.lineGray,
              color: T.white, border: "none", borderRadius: 12,
              padding: "14px 20px", cursor: zip.length === 5 ? "pointer" : "default",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function TournamentCard({ tournament, isSaved, onSave, onSwipeSave, onDismiss, onTap }) {
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState(null);
  const [released, setReleased] = useState(true);
  const startX = useRef(0);
  const startY = useRef(0);
  const swipeMode = useRef(null); // null | "horizontal" | "vertical"
  const cardRef = useRef(null);

  const imageUrl = `https://picsum.photos/seed/golf${tournament.id}/800/500`;

  const handlePointerDown = (e) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    swipeMode.current = null;
    setReleased(false);
  };

  const handlePointerMove = (e) => {
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    // Determine direction on first significant movement
    if (swipeMode.current === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        swipeMode.current = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical";
        if (swipeMode.current === "horizontal") {
          cardRef.current?.setPointerCapture(e.pointerId);
        }
      }
      return;
    }

    if (swipeMode.current !== "horizontal") return;

    setOffset(dx);
    setSwiping(dx > 40 ? "save" : dx < -40 ? "dismiss" : null);
  };

  const handlePointerUp = () => {
    setReleased(true);
    if (swipeMode.current === "horizontal") {
      if (offset > 100) {
        setOffset(600);
        setTimeout(() => { onSwipeSave(tournament.id); setOffset(0); setSwiping(null); }, 220);
      } else if (offset < -100) {
        setOffset(-600);
        setTimeout(() => { onDismiss(tournament.id); setOffset(0); setSwiping(null); }, 220);
      } else {
        setOffset(0);
        setSwiping(null);
      }
    } else if (swipeMode.current === null) {
      onTap(tournament);
    }
    swipeMode.current = null;
  };

  const rotation = offset * 0.05;

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute", inset: 0,
        background: T.white,
        borderRadius: 20,
        overflow: "hidden",
        cursor: "grab",
        transform: `translateX(${offset}px) rotate(${rotation}deg)`,
        transition: released ? "transform 0.25s ease" : "none",
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        userSelect: "none",
        touchAction: "pan-y",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Swipe labels */}
      {swiping === "save" && (
        <div style={{
          position: "absolute", top: 28, left: 20, zIndex: 10,
          background: T.green, color: T.white, borderRadius: 10,
          padding: "6px 16px", fontSize: 18, fontWeight: 800,
          border: "3px solid white", transform: "rotate(-12deg)",
        }}>
          SAVE
        </div>
      )}
      {swiping === "dismiss" && (
        <div style={{
          position: "absolute", top: 28, right: 20, zIndex: 10,
          background: T.error, color: T.white, borderRadius: 10,
          padding: "6px 16px", fontSize: 18, fontWeight: 800,
          border: "3px solid white", transform: "rotate(12deg)",
        }}>
          SKIP
        </div>
      )}

      {/* Hero image */}
      <div style={{
        height: "42%", flexShrink: 0, position: "relative",
        background: `linear-gradient(135deg, ${T.green}, ${T.greenMid})`,
        overflow: "hidden",
      }}>
        <img
          src={imageUrl}
          alt={tournament.course}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.45))",
          padding: "32px 16px 10px",
        }}>
          {tournament.isCharity && (
            <span style={{
              background: "rgba(27,67,50,0.85)", color: T.white,
              padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            }}>
              Charity
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: "16px 20px 8px", overflow: "hidden" }}>
        <h3 style={{
          fontFamily: serif, fontSize: 21, fontWeight: 700,
          color: T.black, margin: "0 0 10px", lineHeight: 1.2,
        }}>
          {tournament.name}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Calendar size={14} color={T.green} />
          <span style={{ fontSize: 14, fontWeight: 600, color: T.green }}>
            {formatDate(tournament.date)} · {tournament.time}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <MapPin size={13} color={T.gray} />
          <span style={{ fontSize: 13, color: T.gray }}>
            {tournament.course} · {tournament.city}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{
            background: T.goldLight, color: T.gold,
            padding: "4px 12px", borderRadius: 8, fontSize: 15, fontWeight: 700,
          }}>
            {formatPrice(tournament.price)}
          </div>
          {tournament.singlesWelcome && (
            <span style={{
              background: "#EBF5FF", color: "#1D4ED8",
              padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            }}>
              Singles OK
            </span>
          )}
          {tournament.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              background: T.bgGray, color: T.gray,
              padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: 20, padding: "12px 20px 20px",
        borderTop: `1px solid ${T.bgGray}`,
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(tournament.id); }}
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#FEF2F2", border: "2px solid #FECACA",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={22} color={T.error} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onTap(tournament); }}
          style={{
            padding: "10px 22px", borderRadius: 12,
            background: T.cream, border: `1.5px solid ${T.lineGray}`,
            fontSize: 14, fontWeight: 600, color: T.gray,
            cursor: "pointer", fontFamily: sans,
          }}
        >
          Details
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSave(tournament.id); }}
          style={{
            width: 52, height: 52, borderRadius: "50%",
            background: isSaved ? T.greenLight : "#F0FFF4",
            border: `2px solid ${isSaved ? T.green : "#BBF7D0"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {isSaved ? <BookmarkCheck size={22} color={T.green} /> : <Bookmark size={22} color={T.green} />}
        </button>
      </div>
    </div>
  );
}

function TournamentDetail({ tournament, isSaved, onSave, onBack }) {
  if (!tournament) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50,
      background: T.cream, display: "flex", flexDirection: "column",
    }}>
      <div style={{
        padding: "20px 16px 12px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: `1px solid ${T.lineGray}`,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            color: T.green, fontSize: 16, fontWeight: 500,
          }}
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={() => onSave(tournament.id)}
          style={{
            background: isSaved ? T.greenLight : T.bgGray,
            border: "none", borderRadius: 10, padding: "8px 14px",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            color: isSaved ? T.green : T.gray, fontSize: 14, fontWeight: 600,
          }}
        >
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        <div style={{
          background: `linear-gradient(135deg, ${T.green}, ${T.greenMid})`,
          borderRadius: 16, height: 160, display: "flex",
          alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <div style={{ textAlign: "center" }}>
            <Flag size={32} color="rgba(255,255,255,0.3)" />
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "8px 0 0" }}>
              {tournament.course}
            </p>
          </div>
        </div>

        <h1 style={{
          fontFamily: serif, fontSize: 28, fontWeight: 700,
          color: T.black, margin: "0 0 16px", lineHeight: 1.2,
        }}>
          {tournament.name}
        </h1>

        <div style={{
          background: T.white, borderRadius: 14, padding: 16,
          marginBottom: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {[
            { icon: <Calendar size={16} color={T.green} />, label: "Date", value: `${formatDateLong(tournament.date)} · ${tournament.time}` },
            { icon: <MapPin size={16} color={T.green} />, label: "Course", value: `${tournament.course}, ${tournament.city}` },
            { icon: <DollarSign size={16} color={T.green} />, label: "Entry", value: `${formatPrice(tournament.price)} per player` },
            { icon: <Users size={16} color={T.green} />, label: "Format", value: tournament.format },
            { icon: <Clock size={16} color={T.green} />, label: "Start", value: tournament.startFormat },
            { icon: <Flag size={16} color={T.green} />, label: "Host", value: tournament.host },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "10px 0",
              borderBottom: i < 5 ? `1px solid ${T.bgGray}` : "none",
            }}>
              <div style={{ marginTop: 2 }}>{row.icon}</div>
              <div>
                <div style={{ fontSize: 12, color: T.gray, marginBottom: 2, textTransform: "uppercase", fontWeight: 600 }}>
                  {row.label}
                </div>
                <div style={{ fontSize: 15, color: T.black, fontWeight: 500 }}>
                  {row.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: tournament.singlesWelcome ? "#EBF5FF" : T.bgGray,
          borderRadius: 12, padding: "12px 16px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Users size={16} color={tournament.singlesWelcome ? "#1D4ED8" : T.gray} />
          <span style={{
            fontSize: 15, fontWeight: 600,
            color: tournament.singlesWelcome ? "#1D4ED8" : T.gray,
          }}>
            {tournament.singlesWelcome ? "Singles welcome" : "Teams only"}
          </span>
        </div>

        {tournament.notes && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 12, color: T.gold, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 10px",
            }}>
              Details
            </h3>
            <p style={{ fontSize: 15, color: T.black, lineHeight: 1.6, margin: 0 }}>
              {tournament.notes}
            </p>
          </div>
        )}

        <div style={{ height: 100 }} />
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "12px 20px 28px",
        background: `linear-gradient(transparent, ${T.cream} 20%)`,
      }}>
        <button
          onClick={() => alert("Opening registration (demo)")}
          style={{
            width: "100%", background: T.green, color: T.white,
            border: "none", borderRadius: 14, padding: "16px 24px",
            fontSize: 17, fontWeight: 700, cursor: "pointer",
            fontFamily: sans, display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
            boxShadow: "0 4px 12px rgba(27,67,50,0.3)",
          }}
        >
          Register Now <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}

function FilterPanel({ visible, filters, onApply, onClose, matchCount }) {
  const [local, setLocal] = useState(filters);

  if (!visible) return null;

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      background: active ? T.green : T.white,
      color: active ? T.white : T.black,
      border: `1.5px solid ${active ? T.green : T.lineGray}`,
      borderRadius: 10, padding: "8px 14px", fontSize: 14, fontWeight: 500,
      cursor: "pointer", fontFamily: sans,
    }}>
      {label}
    </button>
  );

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", flexDirection: "column" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: T.cream, borderRadius: "24px 24px 0 0",
        maxHeight: "85%", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: T.lineGray }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 20px 12px" }}>
          <h2 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: T.black, margin: 0 }}>
            Filters
          </h2>
          <button
            onClick={() => setLocal({ price: "any", date: "any", charity: "any", singles: "any", tags: [] })}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.green, fontSize: 14, fontWeight: 600,
            }}
          >
            Reset All
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "0 20px 20px" }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: T.gold, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Price</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "Any", value: "any" },
                { label: "Under $75", value: "75" },
                { label: "$75–$125", value: "125" },
                { label: "$125+", value: "126" },
              ].map(t => (
                <Chip key={t.value} label={t.label} active={local.price === t.value} onClick={() => setLocal(p => ({...p, price: t.value}))} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: T.gold, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Event Type</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{ label: "All", value: "any" }, { label: "Charity", value: "charity" }, { label: "Competitive", value: "competitive" }].map(t => (
                <Chip key={t.value} label={t.label} active={local.charity === t.value} onClick={() => setLocal(p => ({...p, charity: t.value}))} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: T.gold, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Singles Welcome</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[{ label: "Any", value: "any" }, { label: "Yes", value: "yes" }].map(t => (
                <Chip key={t.value} label={t.label} active={local.singles === t.value} onClick={() => setLocal(p => ({...p, singles: t.value}))} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: T.gold, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Features</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ALL_TAGS.map(tag => (
                <Chip key={tag} label={tag} active={local.tags.includes(tag)} onClick={() => {
                  const tags = local.tags.includes(tag) ? local.tags.filter(t => t !== tag) : [...local.tags, tag];
                  setLocal(p => ({ ...p, tags }));
                }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 20px 28px", borderTop: `1px solid ${T.lineGray}` }}>
          <button
            onClick={() => onApply(local)}
            style={{
              width: "100%", background: T.green, color: T.white,
              border: "none", borderRadius: 14, padding: "16px 24px",
              fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: sans,
            }}
          >
            Show {matchCount} Tournament{matchCount !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ScrambleApp() {
  const [onboarded, setOnboarded] = useState(false);
  const [location, setLocation] = useState("");
  const [tab, setTab] = useState("feed");
  const [savedIds, setSavedIds] = useState(new Set());
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ price: "any", date: "any", charity: "any", singles: "any", tags: [] });

  const feedTournaments = useMemo(() => {
    let result = TOURNAMENTS.filter(t => !dismissedIds.has(t.id));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.course.toLowerCase().includes(q));
    }

    if (filters.price !== "any") {
      const max = parseInt(filters.price);
      if (max === 126) result = result.filter(t => t.price >= 125);
      else result = result.filter(t => t.price <= max);
    }

    if (filters.charity === "charity") result = result.filter(t => t.isCharity);
    if (filters.charity === "competitive") result = result.filter(t => !t.isCharity);
    if (filters.singles === "yes") result = result.filter(t => t.singlesWelcome);

    if (filters.tags.length > 0) {
      result = result.filter(t => filters.tags.some(tag => t.tags.includes(tag)));
    }

    return result;
  }, [dismissedIds, searchQuery, filters]);

  const savedTournaments = useMemo(() => {
    return TOURNAMENTS.filter(t => savedIds.has(t.id)).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [savedIds]);

  const handleSave = useCallback((id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleDismiss = useCallback((id) => {
    setDismissedIds(prev => new Set(prev).add(id));
  }, []);

  const handleSaveFromFeed = useCallback((id) => {
    setSavedIds(prev => { const next = new Set(prev); next.add(id); return next; });
    setDismissedIds(prev => new Set(prev).add(id));
  }, []);

  if (!onboarded) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Onboarding onComplete={(loc) => { setLocation(loc); setOnboarded(true); }} />
      </div>
    );
  }

  const tabs = [
    { id: "feed", label: "Discover", icon: Home },
    { id: "saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: T.cream, fontFamily: sans, color: T.black,
      position: "relative",
    }}>
      <div style={{ paddingTop: 20, paddingBottom: 8, paddingLeft: 20, paddingRight: 20 }}>
        {tab === "feed" && (
          <div>
            <h1 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: T.green, margin: "0 0 12px" }}>
              Scramble
            </h1>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center", gap: 8,
                background: T.white, borderRadius: 12, padding: "10px 14px",
                border: `1.5px solid ${T.lineGray}`,
              }}>
                <Search size={16} color={T.grayLight} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    border: "none", outline: "none", fontSize: 15,
                    fontFamily: sans, background: "transparent", flex: 1, color: T.black,
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: T.grayLight,
                  }}>
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(true)}
                style={{
                  background: T.white, border: `1.5px solid ${T.lineGray}`,
                  borderRadius: 12, padding: "10px 14px", cursor: "pointer",
                }}
              >
                <SlidersHorizontal size={18} color={T.gray} />
              </button>
            </div>
          </div>
        )}
        {tab === "saved" && (
          <h1 style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: T.green, margin: 0 }}>
            Saved Tournaments
          </h1>
        )}
      </div>

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {tab === "feed" && (
          feedTournaments.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
              <Search size={32} color={T.grayLight} style={{ marginBottom: 16 }} />
              <h3 style={{ fontFamily: serif, fontSize: 18, color: T.black, margin: "0 0 8px" }}>
                No tournaments found
              </h3>
            </div>
          ) : (
            <div style={{ flex: 1, overflow: "auto", padding: "4px 16px 16px" }}>
              {feedTournaments.map(t => (
                <div key={t.id} style={{ height: "82vh", flexShrink: 0, marginBottom: 12, position: "relative" }}>
                  <TournamentCard
                    tournament={t}
                    isSaved={savedIds.has(t.id)}
                    onSave={handleSave}
                    onSwipeSave={handleSaveFromFeed}
                    onDismiss={handleDismiss}
                    onTap={setSelectedTournament}
                  />
                </div>
              ))}
            </div>
          )
        )}
        {tab === "saved" && (
          <div style={{ flex: 1, overflow: "auto", padding: "0 20px" }}>
            {savedTournaments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <Bookmark size={32} color={T.grayLight} style={{ display: "block", margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: serif, fontSize: 18, color: T.black, margin: "0 0 8px" }}>
                  Nothing saved yet
                </h3>
                <p style={{ fontSize: 14, color: T.gray }}>Tap the bookmark icon or swipe right to save</p>
              </div>
            ) : (
              <>
                {savedTournaments.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTournament(t)}
                    style={{
                      background: T.white, borderRadius: 14, padding: 16,
                      marginBottom: 10, cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: T.black, margin: "0 0 6px" }}>
                        {t.name}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: T.green }}>
                          {formatDate(t.date)}
                        </span>
                        <span style={{ fontSize: 14, color: T.gray }}>
                          {t.course}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSave(t.id); }}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: 4, color: T.green, flexShrink: 0,
                      }}
                    >
                      <BookmarkCheck size={20} />
                    </button>
                  </div>
                ))}
                <div style={{ paddingBottom: 40 }} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", borderTop: `1px solid ${T.lineGray}`,
        background: T.cream,
      }}>
        {tabs.map(t => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, background: "none", border: "none",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 3, padding: "10px 0 8px",
                color: active ? T.green : T.grayLight,
                position: "relative",
              }}
            >
              {t.id === "saved" && savedIds.size > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: "50%", marginRight: -8,
                  background: T.gold, color: T.white,
                  width: 16, height: 16, borderRadius: "50%",
                  fontSize: 10, fontWeight: 700, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  {savedIds.size}
                </span>
              )}
              <Icon size={20} />
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Detail overlay */}
      {selectedTournament && (
        <TournamentDetail
          tournament={selectedTournament}
          isSaved={savedIds.has(selectedTournament.id)}
          onSave={handleSave}
          onBack={() => setSelectedTournament(null)}
        />
      )}

      {/* Filters */}
      <FilterPanel
        visible={showFilters}
        filters={filters}
        onApply={(f) => { setFilters(f); setShowFilters(false); }}
        onClose={() => setShowFilters(false)}
        matchCount={feedTournaments.length}
      />
    </div>
  );
}

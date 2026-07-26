import { useState, useEffect } from "react";
import { Search, MapPin, Plus, X, Phone, ChevronLeft, Car, Home, Smartphone, Shirt, Sofa, Package } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Dhammaan", icon: Package },
  { id: "cars", label: "Baabuurta", icon: Car },
  { id: "houses", label: "Guryaha", icon: Home },
  { id: "electronics", label: "Elektaroonig", icon: Smartphone },
  { id: "clothes", label: "Dharka", icon: Shirt },
  { id: "furniture", label: "Alaabta guriga", icon: Sofa },
];

const CITIES = ["Dhammaan goobaha", "Muqdisho", "Hargeysa", "Bosaso", "Kismaayo", "Marka", "Baidoa", "Berbera"];

const CAT_ICON = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.icon]));

const SEED = [
  { id: "s1", title: "Toyota Vitz 2015", price: 6500, city: "Hargeysa", category: "cars", phone: "615551234", desc: "Baabuur xaalad wanaagsan, oil-ka wali cusub, wado toos ah oo aan la isticmaalin dhibaato." },
  { id: "s2", title: "Guri kiro ah - 2 qol", price: 200, city: "Bosaso", category: "houses", phone: "907779988", desc: "Guri cusub oo leh koronto iyo biyo joogto ah, u dhow suuqa dhexe." },
  { id: "s3", title: "iPhone 13 Pro", price: 450, city: "Muqdisho", category: "electronics", phone: "615009911", desc: "128GB, midab buluug ah, screen protector iyo case wata." },
  { id: "s4", title: "Dirac cusub - xariir", price: 35, city: "Kismaayo", category: "clothes", phone: "617712345", desc: "Cusub weli lama xirin, cabbir M ah." },
  { id: "s5", title: "Sariir + kabinaale", price: 120, city: "Muqdisho", category: "furniture", phone: "615998877", desc: "Alaab guri oo la iibinayo isla mar, xaalad fiican." },
];

export default function App() {
  const [listings, setListings] = useState(SEED);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("home"); // home | post | detail
  const [activeCategory, setActiveCategory] = useState("all");
  const [city, setCity] = useState("Dhammaan goobaha");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("listings", true);
        if (res && res.value) {
          const stored = JSON.parse(res.value);
          if (Array.isArray(stored) && stored.length) setListings(stored);
        }
      } catch (e) {
        // no stored data yet, keep seed
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.storage.set("listings", JSON.stringify(listings), true).catch(() => {});
  }, [listings, loaded]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = listings.filter((l) => {
    if (activeCategory !== "all" && l.category !== activeCategory) return false;
    if (city !== "Dhammaan goobaha" && l.city !== city) return false;
    if (query.trim() && !l.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  function addListing(newItem) {
    setListings((prev) => [{ ...newItem, id: "l" + Date.now() }, ...prev]);
    setView("home");
    setToast("Alaabtaada waa la daabacay.");
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", fontFamily: "var(--font-sans, sans-serif)", background: "#FBF9F3", minHeight: 600, borderRadius: 20, overflow: "hidden", border: "1px solid #E4DFCF", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input, textarea, select { font-family: inherit; }
      `}</style>

      {view === "home" && (
        <HomeView
          listings={filtered}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          city={city}
          setCity={setCity}
          query={query}
          setQuery={setQuery}
          onSelect={(item) => { setSelected(item); setView("detail"); }}
          onPost={() => setView("post")}
        />
      )}

      {view === "post" && (
        <PostView onCancel={() => setView("home")} onSubmit={addListing} />
      )}

      {view === "detail" && selected && (
        <DetailView item={selected} onBack={() => setView("home")} />
      )}

      {toast && (
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, background: "#1D9E75", color: "#fff", padding: "10px 14px", borderRadius: 10, fontSize: 13, textAlign: "center" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function HomeView({ listings, activeCategory, setActiveCategory, city, setCity, query, setQuery, onSelect, onPost }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 600 }}>
      <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid #E4DFCF" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 19, color: "#0F6E56" }}>
            Suuq<span style={{ color: "#0C447C" }}>Soomaali</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E4DFCF", borderRadius: 10, padding: "9px 12px", marginBottom: 8 }}>
          <Search size={16} color="#888780" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Raadi baabuur, guri, dhar..."
            style={{ border: "none", outline: "none", fontSize: 14, flex: 1, background: "transparent", color: "#2C2C2A" }}
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: "100%", padding: "8px 10px", borderRadius: 10, border: "1px solid #E4DFCF", fontSize: 13, color: "#5F5E5A", background: "#fff" }}
        >
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto" }}>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                borderRadius: 20, padding: "7px 13px", fontSize: 13, flexShrink: 0,
                border: active ? "1px solid #0F6E56" : "1px solid #E4DFCF",
                background: active ? "#E1F5EE" : "#fff",
                color: active ? "#085041" : "#5F5E5A",
              }}
            >
              <Icon size={14} />
              {c.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, padding: "0 16px 90px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, overflowY: "auto" }}>
        {listings.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#888780", fontSize: 13, padding: "40px 0" }}>
            Wax lama helin. Isku day inaad beddesho raadinta.
          </div>
        )}
        {listings.map((item) => {
          const Icon = CAT_ICON[item.category] || Package;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              style={{ textAlign: "left", border: "1px solid #E4DFCF", borderRadius: 12, overflow: "hidden", background: "#fff", padding: 0 }}
            >
              <div style={{ height: 88, background: "#F1EFE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={30} color="#888780" />
              </div>
              <div style={{ padding: "8px 10px" }}>
                <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 3px", color: "#2C2C2A", lineHeight: 1.3 }}>{item.title}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#0C447C", margin: "0 0 3px" }}>${item.price.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: "#888780", margin: 0, display: "flex", alignItems: "center", gap: 3 }}>
                  <MapPin size={11} /> {item.city}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onPost}
        style={{
          position: "absolute", bottom: 20, right: 20, width: 52, height: 52, borderRadius: "50%",
          background: "#0F6E56", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        aria-label="Ku dar alaab cusub"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

function PostView({ onCancel, onSubmit }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("cars");
  const [city, setCity] = useState("Muqdisho");
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!title.trim() || !price || !phone.trim()) {
      setError("Fadlan buuxi magaca, qiimaha, iyo lambarka taleefanka.");
      return;
    }
    onSubmit({ title: title.trim(), price: Number(price), category, city, phone: phone.trim(), desc: desc.trim() });
  }

  return (
    <div style={{ minHeight: 600, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 16, borderBottom: "1px solid #E4DFCF" }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", padding: 4, display: "flex" }} aria-label="Dib u noqo">
          <ChevronLeft size={20} color="#2C2C2A" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Ku dar alaab cusub</span>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, flex: 1, overflowY: "auto" }}>
        <Field label="Magaca alaabta">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tusaale: Toyota Vitz 2015" style={inputStyle} />
        </Field>

        <Field label="Qiimaha ($)">
          <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} placeholder="Tusaale: 500" style={inputStyle} />
        </Field>

        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            {CATEGORIES.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>

        <Field label="Goobta">
          <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle}>
            {CITIES.filter((c) => c !== "Dhammaan goobaha").map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Lambarka taleefanka (WhatsApp)">
          <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} placeholder="Tusaale: 615551234" style={inputStyle} />
        </Field>

        <Field label="Sharaxaad (ikhtiyaari)">
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ku qor faahfaahin dheeraad ah oo ku saabsan alaabta..." rows={4} style={{ ...inputStyle, resize: "none" }} />
        </Field>

        {error && <p style={{ color: "#A32D2D", fontSize: 13, margin: 0 }}>{error}</p>}
      </div>

      <div style={{ padding: 16, borderTop: "1px solid #E4DFCF" }}>
        <button onClick={handleSubmit} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "#0F6E56", color: "#fff", fontWeight: 600, fontSize: 14 }}>
          Daabac alaabta
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12, color: "#5F5E5A", fontWeight: 500 }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #E4DFCF",
  fontSize: 14,
  color: "#2C2C2A",
  background: "#fff",
  outline: "none",
};

function DetailView({ item, onBack }) {
  const Icon = CAT_ICON[item.category] || Package;
  return (
    <div style={{ minHeight: 600, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 16, borderBottom: "1px solid #E4DFCF" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, display: "flex" }} aria-label="Dib u noqo">
          <ChevronLeft size={20} color="#2C2C2A" />
        </button>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Faahfaahinta</span>
      </div>

      <div style={{ height: 180, background: "#F1EFE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={48} color="#888780" />
      </div>

      <div style={{ padding: 16, flex: 1 }}>
        <p style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px", color: "#2C2C2A" }}>{item.title}</p>
        <p style={{ fontSize: 22, fontWeight: 700, color: "#0C447C", margin: "0 0 8px" }}>${item.price.toLocaleString()}</p>
        <p style={{ fontSize: 13, color: "#5F5E5A", display: "flex", alignItems: "center", gap: 4, margin: "0 0 16px" }}>
          <MapPin size={14} /> {item.city}
        </p>
        {item.desc && (
          <p style={{ fontSize: 14, color: "#2C2C2A", lineHeight: 1.6, margin: "0 0 16px" }}>{item.desc}</p>
        )}
      </div>

      <div style={{ padding: 16, borderTop: "1px solid #E4DFCF", display: "flex", gap: 10 }}>
        <a
          href={`https://wa.me/${item.phone}`}
          style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 10, background: "#1D9E75", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
        >
          WhatsApp
        </a>
        <a
          href={`tel:${item.phone}`}
          style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 10, border: "1px solid #E4DFCF", color: "#2C2C2A", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <Phone size={16} /> Wac
        </a>
      </div>
    </div>
  );
}

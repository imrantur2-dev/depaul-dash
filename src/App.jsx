import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Van icon
const vanDivIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:28px; filter: drop-shadow(0 10px 16px rgba(0,0,0,.35));">🚐</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

function formatEta(minutes) {
  if (minutes < 1) return "<1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

const CATEGORIES = ["All", "Snacks", "Drinks", "Essentials", "Food"];

const PRODUCTS = [
  { id: "p1", name: "Red Bull", category: "Drinks", price: 3.49, size: "12 oz", image: "/depaul-dash/products/redbull.jpg" },
  { id: "p2", name: "Gatorade", category: "Drinks", price: 2.49, size: "20 oz", image: "/depaul-dash/products/gatorade.png" },
  { id: "p3", name: "Water", category: "Drinks", price: 1.49, size: "16 oz", image: "/depaul-dash/products/water.png"  },
  { id: "p4", name: "Doritos", category: "Snacks", price: 2.29, size: "2.75 oz", image: "/depaul-dash/products/Doritos.png" },
  { id: "p5", name: "Twix", category: "Snacks", price: 1.79, size: "1.79 oz", image: "/depaul-dash/products/Twix.png" },
  { id: "p6", name: "Gum", category: "Snacks", price: 1.29, size: "pack", image: "/depaul-dash/products/Gum.png" },
  { id: "p7", name: "Advil", category: "Essentials", price: 6.99, size: "20 ct", image: "/depaul-dash/products/Advil.png" },
  { id: "p8", name: "Tide Pods", category: "Essentials", price: 5.99, size: "10 ct", image: "/depaul-dash/products/Tide.png" },
  { id: "p9", name: "Disinfecting Wipes", category: "Essentials", price: 3.49, size: "35 ct", image: "/depaul-dash/products/Wipes.png" },
  { id: "p10", name: "Ramen Cup", category: "Food", price: 2.49, size: "1 cup", image: "/depaul-dash/products/Ramen.png" }, 
  { id: "p11", name: "Protein Bar", category: "Food", price: 2.19, size: "1 bar", image: "/depaul-dash/products/Protein.png" }, 
  { id: "p12", name: "Orange Juice", category: "Drinks", price: 3.29, size: "12 oz", image: "/depaul-dash/products/OJ.png" }, 
  { id: "p13", name: "Shampoo", category: "Essentials", price: 4.49, size: "travel size", image: "/depaul-dash/products/Shampoo.png" },
{ id: "p14", name: "Body Wash", category: "Essentials", price: 5.99, size: "travel size", image: "/depaul-dash/products/BW.png" }, 
{ id: "p15", name: "Soap", category: "Essentials", price: 2.49, size: "1 bar", image: "/depaul-dash/products/Soap.png" }, 
{ id: "p16", name: "Razor", category: "Essentials", price: 3.49, size: "3 pack", image: "/depaul-dash/products/Razor.png" },
{ id: "p17", name: "Toothpaste", category: "Essentials", price: 2.99, size: "travel size", image: "/depaul-dash/products/colgate.png" }, 
{ id: "p18", name: "Toothbrush", category: "Essentials", price: 2.49, size: "1 pc", image: "/depaul-dash/products/TB.png" }, 
{ id: "p19", name: "Deodorant", category: "Essentials", price: 4.99, size: "travel size", image: "/depaul-dash/products/Deodorant.png" }, 
{ id: "p20", name: "Condoms", category: "Essentials", price: 2.99, size: "3 pack", image: "/depaul-dash/products/Condoms.png" }, 
{ id: "p21", name: "Tampons", category: "Essentials", price: 3.49, size: "small pack", image: "/depaul-dash/products/Tampons.png" }, 
{ id: "p22", name: "Notebook", category: "Essentials", price: 2.99, size: "1 pc", image: "/depaul-dash/products/Notebook.png" }, 
{ id: "p23", name: "Pens", category: "Essentials", price: 2.49, size: "3 pack", image: "/depaul-dash/products/Pens.png" }, 
{ id: "p24", name: "Phone Charger", category: "Essentials", price: 3.99, size: "1 pc", image: "/depaul-dash/products/Phone Charger.png" }, 
{ id: "p25", name: "Band-Aids", category: "Essentials", price: 3.49, size: "20 ct", image: "/depaul-dash/products/Band-Aids.png" }, 
{ id: "p26", name: "Laundry Detergent", category: "Essentials", price: 3.49, size: "small bottle", image: "/depaul-dash/products/Detergent.png" }, 
{ id: "p27", name: "Trail Mix", category: "Snacks", price: 2.45, size: "3 oz", image: "/depaul-dash/products/Mix.png" }, 
{ id: "p28", name: "Chips Ahoy", category: "Snacks", price: 2.49, size: "small pack", image: "/depaul-dash/products/Chips Ahoy.png" }, 
{ id: "p29", name: "Mac and Cheese Cup", category: "Food", price: 2.49, size: "1 cup", image: "/depaul-dash/products/MnC.png" }, 
{ id: "p30", name: "Instant Oatmeal", category: "Food", price: 2.79, size: "1 cup", image: "/depaul-dash/products/Instant Oatmeal.png" },
];
const BUILDINGS = [
  "University Hall",
  "Sanctuary Hall",
  "Corcoran Hall",
  "Seton Hall",
  "Ozanam Hall",
  "LeCompte Hall",
  "Munroe Hall",
  "McCabe Hall",
  "Centennial Hall",
  "Sheffield Square",
  "Courtside Apartments",
  "University Center",
  "Student Center",
  "Schmitt Academic Center",
  "Richardson Library",
  "DePaul Center",
  "Lewis Center",
  "CDM Center",
  "McGowan South",
  "Arts & Letters Hall"
];

function ProductThumb({ name, image }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="thumb" aria-hidden>
      <div className="thumbInner">
        {image ? (
  <img
  src={image}
  alt={name}
  style={{
    maxWidth: "100%",
    maxHeight: "100%",
    width: "68%",
    height: "68%",
    objectFit: "contain",
    display: "block"
  }}
/>
) : (
          <div className="thumbMark">{initials}</div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const campusCenter = [41.923, -87.6536];

  const [vanPos, setVanPos] = useState([41.9224, -87.6562]);
  const [destination, setDestination] = useState("Monroe ");
  const [isOnline, setIsOnline] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("summary");
  const [selectedBuilding, setSelectedBuilding] = useState("University Hall");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cartItems, setCartItems] = useState({});
  const [showAllProducts, setShowAllProducts] = useState(false);

  // slow movement
  useEffect(() => {
    const id = setInterval(() => {
      setVanPos((p) => {
        const jitterLat = (Math.random() - 0.5) * 0.00030;
        const jitterLng = (Math.random() - 0.5) * 0.00035;
        return [p[0] + jitterLat, p[1] + jitterLng];
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

    useEffect(() => {
    setShowAllProducts(false);
  }, [activeCategory, query]);

  const etaMinutes = useMemo(() => {
    const dx = Math.abs(vanPos[0] - campusCenter[0]);
    const dy = Math.abs(vanPos[1] - campusCenter[1]);
    const dist = (dx + dy) * 8000;
    return Math.max(5, Math.min(5, dist));
  }, [vanPos]);


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const catOk = activeCategory === "All" || p.category === activeCategory;
      const qOk = !q || p.name.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [activeCategory, query]);

  const visibleProducts = showAllProducts ? filtered : filtered.slice(0, 6);
  const subtotal = Object.entries(cartItems).reduce((sum, [name, qty]) => {
  const product = PRODUCTS.find((p) => p.name === name);
  const BUILDINGS = [
  "Corcoran Hall",
  "LeCompte Hall",
  "Munroe Hall",
  "Ozanam Hall",
  "Seton Hall",
  "University Hall",
  "McCabe Hall",
  "Sanctuary Hall",
  "Sanctuary Townhomes",
  "Centennial Hall",
  "Sheffield Square",
  "Courtside Apartments",
  "University Center",
  "DePaul Center",
  "Lewis Center",
  "Schmitt Academic Center",
  "Richardson Library",
  "Student Center",
  "McGowan South",
  "McGowan North",
  "CDM Center",
  "O’Connell Hall",
  "Arts & Letters Hall"
];
  return sum + (product ? product.price * qty : 0);
}, 0);

const estimatedTax = subtotal * 0.1025;
const total = subtotal + estimatedTax;
const estimatedDeliveryTime = "5–7 min";

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addToCart = (product) => {
  setCartItems((prev) => {
    const updated = {
      ...prev,
      [product.name]: (prev[product.name] || 0) + 1,
    };

    const total = Object.values(updated).reduce((sum, qty) => sum + qty, 0);
    setCartCount(total);

    return updated;
  });
};
const removeFromCart = (productName) => {
  setCartItems((prev) => {
    const updated = { ...prev };

    if (!updated[productName]) return prev;

    updated[productName] -= 1;

    if (updated[productName] <= 0) {
      delete updated[productName];
    }

    const total = Object.values(updated).reduce((sum, qty) => sum + qty, 0);
    setCartCount(total);

    return updated;
  });
};

  return (
    <div className="page">
      <style>{`
        :root{
          --bg:#f5f7fb; --text:#0b1220; --muted:rgba(11,18,32,.68);
          --line:rgba(15,23,42,.10); --blue:#123e75; --red:#c91f2a;
          --shadow2:0 18px 50px rgba(0,0,0,.10);
        }
        *{box-sizing:border-box}
        body{margin:0}
        .page{min-height:100vh;background:var(--bg);color:var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;}
        .navWrap{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.78);
          backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
        .nav{max-width:none;margin:0 auto;padding:12px 24px;display:flex;align-items:center;
          justify-content:space-between;gap:16px}
        .brand{display:flex;align-items:center;gap:10px;font-weight:900}
        .logo{height:34px;width:34px;border-radius:12px;background:linear-gradient(135deg,var(--blue),#0a2a52);
          display:grid;place-items:center;color:white;box-shadow:0 10px 30px rgba(0,0,0,.08)}
        .dash{color:var(--red)}
        .links{display:flex;gap:10px;flex-wrap:wrap}
        .links button{background:transparent;border:none;color:var(--muted);font-weight:800;font-size:13px;
          cursor:pointer;padding:8px 10px;border-radius:10px}
        .links button:hover{color:var(--text);background:rgba(15,23,42,.06)}
        .right{display:flex;gap:10px;align-items:center}
        .cart{
            position:relative;
          display:flex;
          gap:8px;
          align-items:center;
          justify-content:center;
          padding:10px 16px;
          min-height:44px;
          min-width:120px;
          border-radius:12px;
          background:#fff;
          border:1px solid var(--line);
          box-shadow:0 6px 18px rgba(0,0,0,.06);
          font-weight:900;
          font-size:12px;
          cursor:pointer;
        }
        .dot{position:absolute;top:-6px;right:-6px;height:18px;min-width:18px;padding:0 6px;border-radius:999px;
          background:var(--red);color:#fff;font-weight:900;font-size:12px;display:grid;place-items:center;border:2px solid #fff}
        .btn{border:none;border-radius:12px;padding:10px 12px;font-weight:1000;cursor:pointer}
        .btnPrimary{background:var(--red);color:#fff;box-shadow:0 10px 20px rgba(201,31,42,.22)}
        .btnGhost{background:#fff;border:1px solid var(--line);color:var(--text)}
        .container{max-width:none;margin:0;padding:0 24px}
        .hero{margin:16px auto 0;border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#fff,#f3f6ff);
          border:1px solid var(--line);box-shadow:var(--shadow2)}
        .heroInner{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;padding:22px;align-items:center}
        .heroTitle{font-size:44px;line-height:1.05;letter-spacing:-1px;margin:0}
        .heroSub{margin:10px 0 0;color:var(--muted);font-size:15px;max-width:520px}
        .heroActions{margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
        .pill{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:999px;
          background:rgba(18,62,117,.08);border:1px solid rgba(18,62,117,.14);font-weight:1000;font-size:12px}
        .section{margin-top:18px}
        .sectionHeader{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .h2{font-size:26px;letter-spacing:-.4px;margin:0}
        .muted{color:var(--muted);font-size:13px;margin-top:6px}
        .orderCard,.trackCard{margin-top:10px;background:#fff;border:1px solid var(--line);border-radius:24px;
          box-shadow:var(--shadow2);overflow:hidden}
        .orderTop,.trackTop{padding:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;
          border-bottom:1px solid var(--line)}
        .tabs{display:flex;gap:8px;flex-wrap:wrap}
        .tab{border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 12px;font-weight:1000;font-size:12px;
          cursor:pointer;color:rgba(11,18,32,.75)}
        .tab.active{background:rgba(18,62,117,.10);border-color:rgba(18,62,117,.18);color:var(--blue)}
        .search{height:38px;border-radius:14px;border:1px solid var(--line);padding:0 12px;min-width:260px;outline:none;font-weight:900}
        .grid{padding:16px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}
        .item{border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 12px 26px rgba(0,0,0,.05);
          overflow:hidden;display:flex;flex-direction:column}
        .thumb{height:120px;background:linear-gradient(135deg, rgba(18,62,117,.10), rgba(201,31,42,.10));display:grid;place-items:center}
        .thumbInner{
  width: 86%;
  height: 80%;
  border-radius: 16px;
  background: rgba(255,255,255,.8);
  border: 1px solid rgba(15,23,42,.10);
  box-shadow: 0 18px 35px rgba(0,0,0,.06);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 10px;
}
        .thumbMark{font-weight:1000;color:var(--blue);font-size:22px;letter-spacing:-.8px}
        .itemBody{padding:10px 12px;display:flex;flex-direction:column;gap:6px}
        .itemName{font-weight:1000}
        .itemMeta{display:flex;justify-content:space-between;color:rgba(11,18,32,.72);font-weight:900;font-size:12px}
        .add{margin-top:auto;border:none;border-radius:14px;background:var(--red);color:#fff;font-weight:1000;padding:10px 12px;cursor:pointer}
        .mapWrap{height:380px}
        .trackBar{padding:12px 16px;border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between}
        .trackInput{height:40px;border-radius:14px;border:1px solid var(--line);padding:0 12px;min-width:280px;outline:none;font-weight:900}
        .footer{margin-top:22px;padding:22px 0 32px;color:rgba(11,18,32,.65)}
       @media (max-width: 768px){
  .navWrap{
    position: static;
  }

  .nav{
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 14px 16px;
  }

  .brand{
    justify-content: center;
    width: 100%;
  }

  .links{
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 6px;
    width: 100%;
  }

  .links button{
    width: auto;
    min-width: 160px;
    max-width: 220px;
    text-align: center;
    font-size: 14px;
    padding: 10px 12px;
  }

  .right{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
    margin-top: 4px;
  }

  .cart{
    justify-content: center;
  }

  .container{
    padding: 0 12px;
  }

  .heroInner{
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .heroTitle{
    font-size: 34px;
  }

  .sectionHeader,
  .orderTop,
  .trackTop{
    flex-direction: column;
    align-items: stretch;
  }

  .grid{
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 10px;
  }

  .search,
  .trackInput{
    min-width: 0;
    width: 100%;
  }

  .mapWrap{
    height: 300px;
  }
}
  .cartPanel{
  position:absolute;
  top:70px;
  right:24px;
  width:320px;
  background:#fff;
  border:1px solid var(--line);
  border-radius:18px;
  box-shadow:0 18px 50px rgba(0,0,0,.14);
  padding:14px;
  z-index:50;
}

.cartPanelTitle{
  font-size:18px;
  font-weight:1000;
  margin-bottom:10px;
}

.cartEmpty{
  color:var(--muted);
  font-size:14px;
}

.cartRow{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  padding:10px 0;
  border-bottom:1px solid var(--line);
}

.cartRow:last-child{
  border-bottom:none;
}

.cartItemName{
  font-weight:900;
  font-size:14px;
}

.cartQty{
  display:flex;
  align-items:center;
  gap:8px;
}

.qtyBtn{
  border:none;
  background:var(--red);
  color:#fff;
  width:28px;
  height:28px;
  border-radius:8px;
  font-weight:1000;
  cursor:pointer;
}

@media (max-width: 768px){
  .cartPanel{
    right:12px;
    left:12px;
    width:auto;
    top:220px;
  }
} 
  .cartActions{
  display:flex;
  gap:10px;
  margin-top:14px;
}

.cartActionBtn{
  flex:1;
  border:none;
  border-radius:12px;
  padding:12px 14px;
  font-weight:1000;
  cursor:pointer;
}

.cartContinue{
  background:#f1f3f5;
  color:#0b1220;
  border:1px solid var(--line);
}

.cartOrder{
  background:var(--red);
  color:#fff;
}

@media (max-width: 768px){
  .cartActions{
    flex-direction: column;
  }
}
  .qtyControls{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  margin-top:auto;
}

.qtyCount{
  min-width:24px;
  text-align:center;
  font-weight:1000;
}

.qtyBtn{
  border:none;
  background:var(--red);
  color:#fff;
  width:34px;
  height:34px;
  border-radius:10px;
  font-weight:1000;
  cursor:pointer;
}

.add{
  margin-top:auto;
  border:none;
  border-radius:14px;
  background:var(--red);
  color:#fff;
  font-weight:1000;
  padding:10px 12px;
  cursor:pointer;
}
  .seeAllWrap{
  position: relative;
  margin-top: -8px;
  padding: 0 16px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.productsFade{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 56px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(245,247,251,0), rgba(245,247,251,1));
  pointer-events: none;
}

.seeAllBtn{
  position: relative;
  z-index: 2;
  border: 1px solid #d9dee7;
  border-radius: 14px;
  padding: 12px 22px;
  font-weight: 1000;
  cursor: pointer;
  background: #eef1f4;
  color: #0b1220;
  box-shadow: 0 8px 18px rgba(0,0,0,.06);
}

.checkoutOverlay{
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.checkoutPanel{
  width: min(760px, 100%);
  max-height: 92vh;
  overflow: hidden;
  background: #f7f8fa;
  border-radius: 26px;
  box-shadow: 0 30px 80px rgba(0,0,0,.22);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10000;
}

.checkoutHeader{
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 22px 14px;
  background: #fff;
  border-bottom: 1px solid var(--line);
}

.checkoutClose{
  border: none;
  background: transparent;
  font-size: 38px;
  line-height: 1;
  cursor: pointer;
  color: var(--text);
}

.checkoutTitleWrap{
  flex: 1;
  text-align: center;
  margin-right: 38px;
}

.checkoutSmall{
  color: var(--muted);
  font-weight: 900;
  font-size: 16px;
}

.checkoutTitle{
  font-size: 22px;
  font-weight: 1000;
}

.checkoutBody{
  padding: 18px 22px;
  overflow: auto;
}

.checkoutItems{
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom:20px;
}

.checkoutItem{
  display: grid;
  grid-template-columns:92px 1fr;
  gap:14px;
  align-items:center;
  background:#fff;
  border-radius: 18px;
  padding: 12px;
  border: 1px solid var(--line);
}

.checkoutItemImage{
  width: 92px;
  height: 92px;
  border-radius: 16px;
  overflow: hidden;
  background:#fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkoutItemImage .thumb{
  height: 100%;
  width: 100%;
}

.checkoutItemImage .thumbInner{
  width: 100%;
  height: 100%;
  border-radius: 14px;
}

.checkoutItemName{
  font-weight: 1000;
  font-size: 18px;
  line-height: 1.2;
}

.checkoutItemMeta{
  margin-top: 6px;
  color: var(--muted);
  font-weight: 900;
}

.checkoutItemPrice{
  margin-top: 8px;
  font-weight: 1000;
  font-size: 18px;
}

.checkoutSummary{
  margin-top: 20px;
  background: #fff;
  border-radius: 20px;
  padding: 18px;
  border: 1px solid var(--line);
}

.checkoutSummaryTitle{
  font-size: 20px;
  font-weight: 1000;
  margin-bottom: 14px;
}

.checkoutRow{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 18px;
}

.checkoutTotal{
  border-top: 1px solid var(--line);
  margin-top: 8px;
  padding-top: 14px;
  font-weight: 1000;
  font-size: 22px;
}

.checkoutFooter{
  padding: 18px 22px 22px;
  background: #fff;
  border-top: 1px solid var(--line);
}

.checkoutContinueBtn{
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 16px 20px;
  background: var(--red);
  color: #fff;
  font-weight: 1000;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(201,31,42,.25);
}

@media (max-width: 768px){
  .checkoutOverlay{
    padding: 0;
    align-items: flex-end;
  }

  .checkoutPanel{
    width: 100%;
    max-height: 100vh;
    height: 100vh;
    border-radius: 26px 26px 0 0;
  }

  .checkoutHeader{
    padding: 18px 18px 12px;
  }

  .checkoutTitleWrap{
    margin-right: 20px;
  }

  .checkoutSmall{
    font-size: 14px;
  }

  .checkoutTitle{
    font-size: 18px;
  }

  .checkoutBody{
    padding: 16px;
  }

  .checkoutItem{
    grid-template-columns: 78px 1fr;
    gap: 12px;
  }

  .checkoutItemImage{
    width: 78px;
    height: 78px;
  }

  .checkoutItemName{
    font-size: 16px;
  }

  .checkoutItemPrice,
  .checkoutRow{
    font-size: 16px;
  }

  .checkoutContinueBtn{
    font-size: 20px;
  }
}
  .checkoutSection{
  display:flex;
  flex-direction:column;
  gap:16px;
}

.checkoutSectionTitle{
  font-size:22px;
  font-weight:1000;
  margin-bottom:4px;
}

.checkoutCard{
  background:#fff;
  border:1px solid var(--line);
  border-radius:18px;
  padding:16px;
}

.checkoutLabel{
  display:block;
  font-size:14px;
  font-weight:1000;
  margin-bottom:10px;
  color:var(--muted);
}

.checkoutSelect,
.checkoutInput{
  width:100%;
  height:48px;
  border-radius:14px;
  border:1px solid var(--line);
  padding:0 14px;
  font-size:16px;
  font-weight:900;
  outline:none;
  background:#fff;
}

.checkoutInfoText{
  font-size:18px;
  font-weight:1000;
}

.paymentOptions{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.paymentBtn{
  flex:1 1 30%;
  border:1px solid var(--line);
  background:#f4f6f8;
  color:var(--text);
  border-radius:14px;
  padding:12px 14px;
  font-weight:1000;
  cursor:pointer;
}

.paymentBtn.active{
  background:var(--red);
  color:#fff;
  border-color:var(--red);
}
      `}</style>

{isCartOpen && (
  <div className="cartPanel">
    <div className="cartPanelTitle">Your Cart</div>

    {Object.keys(cartItems).length === 0 ? (
      <div className="cartEmpty">Your cart is empty.</div>
    ) : (
      Object.entries(cartItems).map(([name, qty]) => (
        <div className="cartRow" key={name}>
          <div className="cartItemName">{name}</div>

          <div className="cartQty">
            <button className="qtyBtn" onClick={() => removeFromCart(name)}>-</button>
            <span>{qty}</span>
            <button className="qtyBtn" onClick={() => addToCart({ name })}>+</button>
          </div>
        </div>
      ))
    )}

    <div className="cartActions">
      <button
        className="cartActionBtn cartContinue"
        onClick={() => setIsCartOpen(false)}
      >
        Continue Shopping
      </button>

      <button
        className="cartActionBtn cartOrder"
        onClick={() => {
          setCheckoutStep("summary");
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      >
        Order Now
      </button>
    </div>
  </div>
)}

{isCheckoutOpen && (
  <div className="checkoutOverlay">
    <div className="checkoutPanel">
      <div className="checkoutHeader">
        <button
          className="checkoutClose"
          onClick={() => {
            if (checkoutStep === "details") {
              setCheckoutStep("summary");
            } else {
              setIsCheckoutOpen(false);
            }
          }}
        >
          ←
        </button>

        <div className="checkoutTitleWrap">
          <div className="checkoutSmall">
            {checkoutStep === "summary" ? "Checkout" : "Address details"}
          </div>
          <div className="checkoutTitle">DePaul Dash</div>
        </div>
      </div>

      {checkoutStep === "summary" ? (
        <>
          <div className="checkoutBody">
            <div className="checkoutItems">
              {Object.entries(cartItems).map(([name, qty]) => {
                const product = PRODUCTS.find((p) => p.name === name);
                if (!product) return null;

                return (
                  <div className="checkoutItem" key={name}>
                    <div className="checkoutItemImage">
                      <ProductThumb name={product.name} image={product.image} />
                    </div>

                    <div className="checkoutItemInfo">
                      <div className="checkoutItemName">{product.name}</div>
                      <div className="checkoutItemMeta">Qty: {qty}</div>
                      <div className="checkoutItemPrice">
                        ${(product.price * qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="checkoutSummary">
              <div className="checkoutSummaryTitle">Breakdown</div>

              <div className="checkoutRow">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="checkoutRow">
                <span>Est. Tax (10.25%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="checkoutRow checkoutTotal">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="checkoutFooter">
            <button
              className="checkoutContinueBtn"
              type="button"
              onClick={() => setCheckoutStep("details")}
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="checkoutBody">
            <div className="checkoutSection">
              <div className="checkoutSectionTitle">Address details</div>

              <div className="checkoutCard">
                <label className="checkoutLabel">Choose building</label>
                <select
                  className="checkoutSelect"
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                >
                  {BUILDINGS.map((building) => (
                    <option key={building} value={building}>
                      {building}
                    </option>
                  ))}
                </select>
              </div>

              <div className="checkoutCard">
                <label className="checkoutLabel">Phone number</label>
                <input
                  className="checkoutInput"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="checkoutCard">
                <div className="checkoutLabel">Estimated delivery time</div>
                <div className="checkoutInfoText">{estimatedDeliveryTime}</div>
              </div>

              <div className="checkoutCard">
                <div className="checkoutLabel">Payment method</div>

                <div className="paymentOptions">
                  <button
                    type="button"
                    className={paymentMethod === "Card" ? "paymentBtn active" : "paymentBtn"}
                    onClick={() => setPaymentMethod("Card")}
                  >
                    Card
                  </button>

                  <button
                    type="button"
                    className={paymentMethod === "Cash" ? "paymentBtn active" : "paymentBtn"}
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    Cash
                  </button>
                <button
                    type="button"
                    className={paymentMethod === "Blue Bucks" ? "paymentBtn active" : "paymentBtn"}
                    onClick={() => setPaymentMethod("Blue Bucks")}
                  >
                    Blue Bucks
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="checkoutFooter">
            <button
              className="checkoutContinueBtn"
              type="button"
              onClick={() => alert("Only a prototype yet")}
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
      {/* NAV */}
      <div className="navWrap">
        <div className="nav">
          <div className="brand">
            <div className="logo">DD</div>
            <span>
              DePaul <span className="dash">Dash</span>
            </span>
          </div>

          <div className="links">
            <button onClick={() => scrollToId("home")}>Home</button>
            <button onClick={() => scrollToId("order")}>Shop</button>
            <button onClick={() => scrollToId("track")}>Track the Truck</button>
            <button
              onClick={() => {
                const appUrl = "linkedin://in/imran-turyshov-017937395";
                const webUrl = "https://www.linkedin.com/in/imran-turyshov-017937395?trk=contact-info";

                window.location.href = appUrl;

                setTimeout(() => {
                  window.open(webUrl, "_blank");
                }, 800);
              }}
            >
              Contact
            </button>
          </div>

          <div className="right">
            <div className="cart" onClick={() => setIsCartOpen((v) => !v)}>
          🛒 Cart
           {cartCount > 0 && <div className="dot">{cartCount}</div>}
          </div>
            <button className="btn btnGhost" onClick={() => alert("Login (prototype)")}>
              Log in
            </button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div id="home" className="container">
        <div className="hero">
          <div className="heroInner">
            <div>
              <h1 className="heroTitle">Students’ One-Stop Shop on Wheels</h1>
              <div className="heroSub">
                Snacks, drinks, and everyday essentials delivered to you on DePaul’s Lincoln Park campus.
              </div>

              <div className="heroActions">
                <button className="btn btnPrimary" onClick={() => scrollToId("order")}>Order Now</button>
                <button className="btn btnGhost" onClick={() => scrollToId("track")}>Track the Truck</button>
                <div className="pill">
                  Currently delivering: <b style={{ color: "var(--blue)" }}>{formatEta(etaMinutes)}</b>
                </div>
              </div>
            </div>

            <div style={{ borderRadius: 22, padding: 18, background: "linear-gradient(135deg, rgba(18,62,117,.14), rgba(201,31,42,.10))", border: "1px solid rgba(15,23,42,.10)" }}>
              <div style={{ fontWeight: 1000, fontSize: 14 }}>DePaul Dash Truck</div>
              <div style={{ color: "rgba(11,18,32,.70)", marginTop: 4, fontWeight: 800, fontSize: 13 }}>
                Live campus delivery • clean + fast
              </div>
            </div>
          </div>
        </div>

        {/* ORDER */}
        <div id="order" className="section">
          <div className="sectionHeader">
            <div>
              <h2 className="h2">Order Online</h2>
              <div className="muted">Choose a category, search items, add to cart.</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input className="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="btn btnPrimary" onClick={() => alert("Checkout (prototype)")}>Checkout</button>
            </div>
          </div>

          <div className="orderCard">
            <div className="orderTop">
              <div className="tabs">
                {CATEGORIES.map((c) => (
                  <button key={c} className={`tab ${activeCategory === c ? "active" : ""}`} onClick={() => setActiveCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="pill">
                {isOnline ? "Truck active" : "Tracking paused"} • ETA{" "}
                <b style={{ color: "var(--blue)" }}>{isOnline ? formatEta(etaMinutes) : "—"}</b>
              </div>
            </div>

            
  <div className="grid">
  {visibleProducts.map((p) => (
    <div key={p.id} className="item">
      <ProductThumb name={p.name} image={p.image} />
      <div className="itemBody">
        <div className="itemName">{p.name}</div>

        <div className="itemMeta">
          <span>{p.size}</span>
          <span>${p.price.toFixed(2)}</span>
        </div>

        {cartItems[p.name] ? (
          <div className="qtyControls">
            <button
              className="qtyBtn"
              onClick={() => removeFromCart(p.name)}
            >
              -
            </button>

            <span className="qtyCount">{cartItems[p.name]}</span>

            <button
              className="qtyBtn"
              onClick={() => addToCart(p)}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="add"
            onClick={() => addToCart(p)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  ))}
</div>

{!showAllProducts && filtered.length > 6 && (
  <div className="seeAllWrap">
    <div className="productsFade" />
    <button
      className="seeAllBtn"
      onClick={() => setShowAllProducts(true)}
    >
      See All
    </button>
  </div>
)}
</div>
</div>
        {/* TRACK */}
        <div id="track" className="section">
          <div className="sectionHeader">
            <div>
              <h2 className="h2">Track the Truck on Campus</h2>
              <div className="muted">See our real-time location and meet us curbside.</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input className="trackInput" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter DePaul address" />
              <button className="btn btnPrimary" onClick={() => alert("Track (prototype)")}>Track Truck</button>
              <button className="btn btnGhost" onClick={() => setIsOnline((v) => !v)}>{isOnline ? "Live: ON" : "Live: OFF"}</button>
            </div>
          </div>

          <div className="trackCard">
            <div className="mapWrap">
              <MapContainer center={campusCenter} zoom={15} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {isOnline && (
                  <Marker position={vanPos} icon={vanDivIcon}>
                    <Popup>
                      <div style={{ fontSize: 14 }}>
                        <b>DePaul Dash Truck</b>
                        <div>ETA: {formatEta(etaMinutes)}</div>
                        <div style={{ opacity: 0.7 }}>Arriving at: {destination}</div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                <Marker position={campusCenter}>
                  <Popup>
                    <div style={{ fontSize: 14 }}>
                      <b>Campus</b>
                      <div style={{ opacity: 0.7 }}>Pickup / drop-off zone</div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="trackBar">
              <div style={{ fontWeight: 1000 }}>
                <span style={{ color: "var(--blue)" }}>●</span> Arriving at{" "}
                <span style={{ color: "var(--blue)" }}>{destination}</span> | ETA:{" "}
                {isOnline ? formatEta(etaMinutes) : "—"}
              </div>
              <div style={{ color: "rgba(11,18,32,.70)", fontWeight: 900, fontSize: 12 }}>
                Truck: 🚐 • Your location: (future)
              </div>
            </div>
          </div>
        </div>

        <div id="contact" className="footer">
          <div style={{ fontSize: 12 }}>© {new Date().getFullYear()} DePaul Dash (prototype)</div>
        </div>
      </div>
    </div>
  );
}

import { useState, ReactNode, useMemo, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  MapPin, 
  ShoppingBag, 
  PlusSquare, 
  Clock, 
  Phone, 
  Star, 
  Stethoscope, 
  Thermometer, 
  Droplets,
  Heart,
  ShieldCheck,
  Instagram,
  Twitter,
  Facebook,
  ChevronRight,
  X,
  CheckCircle2,
  Mail,
  HelpCircle,
  Search,
  Plus,
  Minus,
  AlertCircle,
  Droplet,
  Sparkles,
  Baby,
  Edit2, 
  Trash2, 
  LayoutDashboard, 
  Settings, 
  Save, 
  RefreshCw,
  Camera,
  Moon,
  Sun,
  BellRing,
  FileText,
  Truck,
  MessageCircle
} from "lucide-react";

// --- Types ---

interface Product {
  id: string | number;
  name: string;
  price: number;
  rating: number;
  type: string;
  category: string;
  description: string;
  image: string;
  icon?: ReactNode;
  iconName?: string;
}

interface Branding {
  name: string;
  accentTitle: string;
  tagline: string;
  primaryColor: string; // #1a2b4b
  secondaryColor: string; // #3eb489
}

interface CartItem extends Product {
  quantity: number;
}

// --- Dummy Data ---

const DEFAULT_HOSPITALS = [
  { id: 1, name: "Apollo Multispecialty", distance: "1.2 km", specialists: "Cardiology, Neurology" },
  { id: 2, name: "City General Hospital", distance: "2.5 km", specialists: "Emergency, Pediatrics" },
  { id: 3, name: "Medanta Medicity", distance: "3.8 km", specialists: "Oncology, Orthopedics" },
  { id: 4, name: "AIIMS Medical Center", distance: "5.1 km", specialists: "Research, Advanced Care" },
];

const DEFAULT_STORES = [
  { id: 1, name: "24hr Pharmacy", address: "45 Medical Lane, Sector 12", timing: "Open 24/7", phone: "+92 21 34567890" },
  { id: 2, name: "HealthPlus Store", address: "G-Block, Central Market", timing: "9:00 AM - 10:00 PM", phone: "+92 21 34567891" },
  { id: 3, name: "MedExpress", address: "Near City Metro Station", timing: "8:00 AM - 11:30 PM", phone: "+92 21 34567892" },
];

const ICON_MAP: { [key: string]: ReactNode } = {
  Thermometer: <Thermometer className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  PlusSquare: <PlusSquare className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Baby: <Baby className="w-6 h-6" />,
  Stethoscope: <Stethoscope className="w-6 h-6" />,
};

const INITIAL_PRODUCTS: Product[] = [
  // Pharmacy
  { id: 1, name: "Paracetamol 500mg", price: 150, rating: 4.8, type: "Tablet", category: "Pharmacy", description: "Effective for managing pain and reducing fever. Essential for every first-aid kit.", image: "", iconName: "Thermometer" },
  { id: 2, name: "Herbal Cough Syrup", price: 320, rating: 4.6, type: "Syrup", category: "Pharmacy", description: "Fast-acting relief for dry and wet cough. Made with natural honey and herbs.", image: "", iconName: "Droplets" },
  { id: 3, name: "Advanced Multivitamins", price: 1200, rating: 4.7, type: "Capsule", category: "Pharmacy", description: "A comprehensive blend of 24 essential vitamins and minerals for daily health support.", image: "", iconName: "Activity" },
  
  // Skin Care
  { id: 20, name: "Adapalene Acne Gel", price: 850, rating: 4.7, type: "Tube", category: "Skin Care", description: "Retinoid treatment for acne-prone skin. Use at night for best results.", image: "", iconName: "ShieldCheck" },
  { id: 21, name: "Benzoyl Peroxide 5%", price: 450, rating: 4.5, type: "Tube", category: "Skin Care", description: "Kills acne-causing bacteria and prevents future breakouts.", image: "", iconName: "ShieldCheck" },
  { id: 22, name: "Salicylic Face Wash", price: 950, rating: 4.8, type: "Wash", category: "Skin Care", description: "Deep cleansing formula to unclog pores and reduce excess oil.", image: "", iconName: "Droplets" },
  { id: 23, name: "Gentle Skin Cleanser", price: 1100, rating: 4.9, type: "Wash", category: "Skin Care", description: "Non-irritating, soap-free cleanser for daily use on sensitive skin.", image: "", iconName: "Droplets" },

  // Baby Care
  { id: 30, name: "Diaper Rash Cream", price: 550, rating: 4.9, type: "Tube", category: "Baby Care", description: "Fast relief and protection against diaper rash for delicate baby skin.", image: "", iconName: "PlusSquare" },
  { id: 31, name: "Sensitive Baby Lotion", price: 850, rating: 4.8, type: "Lotion", category: "Baby Care", description: "Hypoallergenic moisturizing lotion specifically formulated for newborns.", image: "", iconName: "Droplets" },
  { id: 32, name: "No-Tears Baby Shampoo", price: 720, rating: 4.7, type: "Wash", category: "Baby Care", description: "Gentle cleansing for baby's hair and scalp without irritation.", image: "", iconName: "Droplets" },

  // Mother Care
  { id: 40, name: "Prenatal Gold Vitamins", price: 2500, rating: 4.9, type: "Tablet", category: "Mother Care", description: "Complete nutrition for expectant mothers with Folic Acid and Iron.", image: "", iconName: "Activity" },
  { id: 41, name: "Stretch Mark Cream", price: 1800, rating: 4.6, type: "Cream", category: "Mother Care", description: "Reduces the appearance of stretch marks and improves skin elasticity.", image: "", iconName: "ShieldCheck" },

  // Devices & Others
  { id: 10, name: "Antiseptic Liquid", price: 450, rating: 4.9, type: "Liquid", category: "First Aid", description: "Multi-purpose germ protection for first aid, surface cleaning, and personal hygiene.", image: "", iconName: "ShieldCheck" },
  { id: 11, name: "Digital Thermometer", price: 550, rating: 4.9, type: "Electronic", category: "Devices", description: "Rapid and accurate digital readings for the whole family.", image: "", iconName: "Thermometer" },
  { id: 6, name: "Premium BP Monitor", price: 8500, rating: 4.9, type: "Device", category: "Devices", description: "Clinically validated automatic blood pressure monitor with heart rhythm detection.", image: "", iconName: "Heart" },
  { id: 50, name: "Acne Patches", price: 420, rating: 4.9, type: "Pack", category: "Skin Care", description: "Hydrocolloid patches for quick spot treatment and faster healing.", image: "", iconName: "Sparkles" },
  { id: 51, name: "Baby Talc Powder", price: 280, rating: 4.7, type: "Powder", category: "Baby Care", description: "Gentle, moisture-absorbing powder for healthy, soft baby skin.", image: "", iconName: "Baby" },
];

// --- Components ---

const BrandLogo = ({ className = "", branding }: { className?: string, branding: Branding }) => (
  <div className={`flex flex-col items-center select-none ${className}`}>
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
      {/* The Broken Capsule Icon */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Left Half (Navy) - Broken Effect */}
        <g transform="rotate(25, 100, 105)">
          <path 
            d="M75,65 C55,65 40,80 40,100 L40,120 C40,140 55,155 75,155 L95,155 L95,65 L75,65 Z" 
            fill={branding.primaryColor} 
            className="translate-x-[-15px] translate-y-[-5px]"
          />
        </g>
        
        {/* Right Half (Green) - Broken Effect */}
        <g transform="rotate(25, 100, 105)">
          <path 
            d="M105,65 L125,65 C145,65 160,80 160,100 L160,120 C160,140 145,155 125,155 L105,155 L105,65 Z" 
            fill={branding.secondaryColor} 
            className="translate-x-[15px] translate-y-[5px]"
          />
        </g>
        
        {/* Leaves Rising from Center */}
        <g transform="translate(100, 95)">
          <motion.g
            animate={{ y: [-10, -50], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeOut" }}
          >
            <path d="M0,0 C5,-15 -5,-25 0,-35 C5,-25 -5,-15 0,0" fill={branding.primaryColor} transform="translate(-15, -10) rotate(-20)" />
          </motion.g>
          
          <motion.g
            animate={{ y: [-5, -60], opacity: [0, 1, 0], scale: [0.4, 1.1, 0.7] }}
            transition={{ repeat: Infinity, duration: 3.5, delay: 0.5, ease: "easeOut" }}
          >
            <path d="M0,0 C5,-12 -5,-20 0,-28 C5,-20 -5,-12 0,0" fill={branding.secondaryColor} transform="translate(10, -20) rotate(15)" />
          </motion.g>
          
          <motion.g
            animate={{ y: [0, -70], opacity: [0, 1, 0], scale: [0.3, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeOut" }}
          >
            <path d="M0,0 C4,-10 -4,-18 0,-25 C4,-18 -4,-10 0,0" fill={branding.primaryColor} transform="translate(-5, -40) rotate(-10)" />
          </motion.g>

          <motion.g
            animate={{ y: [10, -40], opacity: [0, 0.8, 0], scale: [0.2, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 4.5, delay: 0.2 }}
          >
             <circle cx="0" cy="0" r="2" fill={branding.secondaryColor} transform="translate(20, -10)" />
             <circle cx="0" cy="0" r="1.5" fill={branding.primaryColor} transform="translate(-25, -5)" />
          </motion.g>
        </g>

        {/* Mouse Cursor */}
        <g transform="translate(40, 105) rotate(15)">
          <path d="M0,0 L18,10 L10,12 L14,18 L11,20 L7,14 L0,20 Z" fill="white" stroke={branding.primaryColor} strokeWidth="1.5" />
        </g>
      </svg>
    </div>
    
    <div className="mt-[-20px] text-center">
      <div className="flex justify-center items-baseline">
        <span className="text-5xl md:text-7xl font-black tracking-tighter" style={{ color: branding.primaryColor }}>{branding.name}</span>
        <span className="text-5xl md:text-7xl font-black tracking-tighter" style={{ color: branding.secondaryColor }}>{branding.accentTitle}</span>
      </div>
      <p className="mt-4 text-base md:text-xl font-bold tracking-widest uppercase" style={{ color: branding.secondaryColor }}>
        {branding.tagline}
      </p>
    </div>
  </div>
);

const LogoIcon = ({ className = "w-6 h-6", branding }: { className?: string, branding: Branding }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm overflow-visible">
      <g transform="rotate(25, 100, 105)">
        <path
          d="M75,65 C55,65 40,80 40,100 L40,120 C40,140 55,155 75,155 L95,155 L95,65 L75,65 Z"
          fill={branding.primaryColor}
          transform="translate(-10,-4)"
        />
      </g>
      <g transform="rotate(25, 100, 105)">
        <path
          d="M105,65 L125,65 C145,65 160,80 160,100 L160,120 C160,140 145,155 125,155 L105,155 L105,65 Z"
          fill={branding.secondaryColor}
          transform="translate(10,4)"
        />
      </g>
      <motion.path
        d="M100,90 C106,78 98,68 103,58 C108,68 100,78 100,90"
        fill={branding.secondaryColor}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

const Navbar = ({ cartCount, onCartClick, onTrackClick, branding, isAdmin, onToggleAdmin, isDarkMode, onToggleTheme }: { cartCount: number, onCartClick: () => void, onTrackClick: () => void, branding: Branding, isAdmin: boolean, onToggleAdmin: () => void, isDarkMode: boolean, onToggleTheme: () => void }) => (
  <nav className={`fixed top-0 left-0 w-full z-100 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b transition-colors ${isDarkMode ? 'bg-slate-950/85 border-slate-800' : 'bg-white/80 border-medical-accent/10'}`}>
    <div className="flex items-center gap-2">
      <div className="bg-medical-accent/10 p-1.5 rounded-lg medical-glow border border-medical-accent/20">
        <LogoIcon className="w-6 h-6" branding={branding} />
      </div>
      <span className="text-xl font-bold tracking-tight" style={{ color: branding.primaryColor }}>
        {branding.name}<span style={{ color: branding.secondaryColor }}>{branding.accentTitle}</span>
      </span>
    </div>
    
    <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
      <a href="#products" className="hover:text-medical-accent transition-colors">Products</a>
      <a href="#emergency" className="hover:text-medical-accent transition-colors">Emergency</a>
      <a href="#blood" className="hover:text-medical-accent transition-colors">Blood Bank</a>
      <button onClick={onTrackClick} className="hover:text-medical-accent transition-colors">Track Order</button>
      <a href="#help" className="hover:text-medical-accent transition-colors">Help</a>
    </div>
    
    <div className="flex gap-3 items-center">
      <button
        onClick={onToggleTheme}
        className={`p-2.5 rounded-xl transition-all border ${isDarkMode ? 'bg-slate-900 text-amber-300 border-slate-700 hover:text-amber-200' : 'bg-white text-slate-500 border-slate-200 hover:text-medical-accent'}`}
        title="Toggle Theme"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <button 
        onClick={onToggleAdmin}
        className={`p-2.5 rounded-xl transition-all border ${isAdmin ? 'bg-medical-accent text-white border-medical-accent' : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-medical-accent'}`}
        title="Toggle Admin Panel"
      >
        <Settings className="w-5 h-5" />
      </button>
      <button 
        onClick={onCartClick}
        className="relative bg-medical-accent/10 hover:bg-medical-accent/20 text-medical-accent border border-medical-accent/30 p-2.5 rounded-xl transition-all"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </nav>
);

const Hero = ({ branding }: { branding: Branding }) => (
  <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[70vh] flex flex-col justify-center items-center text-center bg-white">
    <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(62,180,137,0.1)_0%,transparent_70%)] pointer-events-none -z-10" />
    <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(26,43,75,0.05)_0%,transparent_70%)] pointer-events-none -z-10" />

    <motion.div 
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 110, damping: 17 }}
      className="max-w-4xl"
    >
      <motion.div 
        animate={{ rotate: [0, 1.2, 0, -1.2, 0], scale: [1, 1.01, 1] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="mb-8"
      >
        <BrandLogo branding={branding} />
      </motion.div>

      <div className="flex flex-wrap gap-8 justify-center mb-12 text-[#1a2b4b]/60 font-medium mt-12 bg-medical-secondary/50 p-4 rounded-3xl border border-medical-accent/10">
        {[
          "Find Medicines",
          "Compare Prices",
          "Order Easily"
        ].map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-medical-accent" />
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#products" className="cta text-center medical-glow !bg-[#1a2b4b] hover:!bg-medical-accent hover:!text-white transition-all">
          Order Now
        </a>
        <button className="bg-medical-secondary text-medical-accent-dark font-bold px-8 py-4 rounded-xl text-lg transition-all border border-medical-accent/20 hover:bg-medical-accent/10">
          Nearby Hospitals
        </button>
      </div>
    </motion.div>
  </section>
);

const ProductDetailsModal = ({ product, onClose, onAddToCart }: { product: Product, onClose: () => void, onAddToCart: (p: Product) => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-8 relative shadow-2xl"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-[#1a2b4b] transition-colors">
        <X className="w-6 h-6" />
      </button>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="bg-medical-secondary/50 p-4 rounded-3xl text-medical-accent border border-medical-accent/10 w-full md:w-48 h-48 flex items-center justify-center overflow-hidden flex-shrink-0">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="scale-[2.5]">{product.icon || (product.iconName && ICON_MAP[product.iconName])}</div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-black text-[#1a2b4b] mb-2">{product.name}</h2>
          <span className="text-medical-accent text-xs uppercase font-black tracking-widest bg-medical-secondary/50 px-3 py-1.5 rounded-full w-fit">{product.category}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest border-b border-slate-100 pb-1">Product Info</h4>
          <p className="text-slate-600 leading-relaxed text-sm">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between py-6">
          <div>
            <span className="text-slate-400 text-xs block mb-1 font-bold italic">Price</span>
            <span className="text-3xl font-bold text-[#1a2b4b] font-mono">Rs. {product.price.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => { onAddToCart(product); onClose(); }}
            className="cta px-10 py-4 flex items-center gap-3 !bg-[#1a2b4b] hover:!bg-medical-accent"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Order
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const CheckoutModal = ({ cart, updateCart, onClose, onFinish }: { cart: CartItem[], updateCart: (p: CartItem, q: number) => void, onClose: () => void, onFinish: (id: string) => void }) => {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '' });
  const total = cart.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const orderId = useMemo(() => "CM-" + Math.random().toString(36).substr(2, 9).toUpperCase(), []);
  
  const handlePlaceOrder = async () => {
    try {
      const response = await window.fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
          total,
          customer
        })
      });
      if (response.ok) {
        setStep(3);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Order system error.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-8 relative max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
      >
        {step < 3 && (
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-[#1a2b4b] transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
        
        {step === 1 && (
          <div className="space-y-6 text-[#1a2b4b]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Review Order</h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">ID: {orderId}</span>
            </div>
            <div className="space-y-3">
              {cart.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <span className="font-bold block text-sm">{p.name}</span>
                    <span className="text-slate-500 text-xs">Rs. {p.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      <button 
                        onClick={() => updateCart(p, -1)}
                        className="text-slate-400 hover:text-medical-accent"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-sm min-w-[20px] text-center">{p.quantity}</span>
                      <button 
                        onClick={() => updateCart(p, 1)}
                        className="text-slate-400 hover:text-medical-accent"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[#1a2b4b] font-mono font-bold w-20 text-right text-sm">Rs. {(p.price * p.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <p className="text-slate-400 text-center py-10">Your cart is empty.</p>}
            </div>
            
            {cart.length > 0 && (
              <>
                <div className="flex justify-between items-center text-xl font-bold pt-6 border-t border-slate-100">
                  <span>Grand Total</span>
                  <span className="text-medical-accent font-mono">Rs. {total.toLocaleString()}</span>
                </div>
                <button onClick={() => setStep(2)} className="w-full cta py-4 mt-6">
                  Delivery Details
                </button>
              </>
            )}
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6 text-[#1a2b4b]">
            <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Full Name" 
                value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-medical-accent transition-all text-sm shadow-inner" 
              />
              <input 
                type="text" placeholder="House/Flat No, Area" 
                value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-medical-accent transition-all text-sm shadow-inner" 
              />
              <input 
                type="text" placeholder="Phone Number" 
                value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-medical-accent transition-all text-sm shadow-inner" 
              />
            </div>
            <div className="bg-medical-secondary/50 p-4 rounded-xl border border-medical-accent/10">
              <p className="text-xs text-medical-accent font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Payment Method: Cash on Delivery (COD)
              </p>
            </div>
            <button onClick={handlePlaceOrder} className="w-full cta py-4 mt-4 !bg-[#1a2b4b] hover:!bg-medical-accent transition-all">
              Place Order
            </button>
          </div>
        )}
        
        {step === 3 && (
          <div className="text-center py-10 space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-medical-accent" />
            </div>
            <h2 className="text-3xl font-bold text-[#1a2b4b]">Thank You!</h2>
            <div className="space-y-2">
              <p className="text-slate-500">Your order has been placed successfully.</p>
              <p className="text-slate-400 text-sm">
                Order ID: <span className="text-[#1a2b4b] font-mono font-bold">{orderId}</span>
              </p>
            </div>
            <button onClick={() => { onFinish(orderId); onClose(); }} className="w-full cta py-4">
              Return Home
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const EmergencySection = () => (
  <section id="emergency" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-red-50 border border-red-100 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-sm"
    >
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <AlertCircle className="w-48 h-48 text-red-600" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-red-600 p-3 rounded-xl shadow-lg"
          >
            <AlertCircle className="text-white w-6 h-6" />
          </motion.div>
          <span className="text-red-700 font-black uppercase tracking-widest text-sm">Emergency Rescue</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">Critical Care, <br /><span className="text-red-600">Instantly.</span></h2>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
              Immediate medical support for emergencies. Find the nearest trauma center or call a frontline responder available 24/7.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:1122" className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-5 rounded-2xl flex items-center gap-3 transition-all shadow-xl shadow-red-200 hover:-translate-y-0.5">
                <Phone className="w-5 h-5" />
                Call 1122
              </a>
              <button className="bg-white border border-slate-200 hover:border-red-600 hover:text-red-600 text-slate-700 font-bold px-10 py-5 rounded-2xl transition-all shadow-sm">
                Doctor Consultation
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
              <h4 className="font-bold text-slate-800 mb-1">Ambulance</h4>
              <p className="text-[10px] uppercase font-black text-red-600 tracking-widest">Active Now</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-red-600/30" />
              <h4 className="font-bold text-slate-800 mb-1">Trauma Unit</h4>
              <p className="text-xs text-slate-400">4 nearby</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-red-600/30" />
              <h4 className="font-bold text-slate-800 mb-1">Oxygen Supply</h4>
              <p className="text-xs text-slate-400">Limited Stock</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
              <h4 className="font-bold text-slate-800 mb-1">Night Pharmacy</h4>
              <p className="text-[10px] uppercase font-black text-red-600 tracking-widest">Open Now</p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

const BloodDonationSection = ({ branding }: { branding: Branding }) => {
  const [showForm, setShowForm] = useState(false);
  const [donorData, setDonorData] = useState({ name: '', bloodType: 'A+', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!donorData.name || !donorData.phone) {
      alert('Please fill in all details.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await window.fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData)
      });
      if (response.ok) {
        alert('Thank you for registering as a donor!');
        setShowForm(false);
        setDonorData({ name: '', bloodType: 'A+', phone: '' });
      } else {
        alert('Registration failed.');
      }
    } catch (e) {
      alert('Error connecting to donor system.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="blood" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-16">
        <h2 className="text-xs font-bold text-medical-accent uppercase tracking-[3px] whitespace-nowrap italic">Life Savers</h2>
        <div className="h-[1px] w-full bg-slate-100"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 p-10 rounded-[40px] relative overflow-hidden group shadow-2xl" style={{ backgroundColor: branding.primaryColor }}>
          <Droplet className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 transition-transform group-hover:scale-110 rotate-12" />
          <div className="relative z-10">
            <h3 className="text-4xl font-black text-white mb-6">Be a Hero, <br /><span style={{ color: branding.secondaryColor }}>Donate Blood.</span></h3>
            <p className="text-white/60 text-lg mb-12 max-w-xl leading-relaxed">
              Every drop counts. Join the {branding.name}{branding.accentTitle} life-saving network to help bridge the critical blood shortage in your city.
            </p>
            
            <AnimatePresence>
              {showForm ? (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 mb-8 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input 
                      type="text" placeholder="Your Name" 
                      value={donorData.name} onChange={e => setDonorData({...donorData, name: e.target.value})}
                      className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-white/50" 
                    />
                    <select 
                      value={donorData.bloodType} onChange={e => setDonorData({...donorData, bloodType: e.target.value})}
                      className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 outline-none text-white"
                    >
                      {['Type A+', 'Type A-', 'Type B+', 'Type B-', 'Type O+', 'Type O-', 'Type AB+', 'Type AB-'].map(t => <option key={t} value={t} className="text-black">{t}</option>)}
                    </select>
                    <input 
                      type="text" placeholder="Phone" 
                      value={donorData.phone} onChange={e => setDonorData({...donorData, phone: e.target.value})}
                      className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 outline-none text-white placeholder:text-white/50" 
                    />
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleRegister} 
                      disabled={isSubmitting}
                      className="bg-medical-accent text-white font-black px-8 py-3 rounded-xl hover:scale-105 transition-all text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                    </button>
                    <button 
                      onClick={() => setShowForm(false)} 
                      className="text-white/70 font-bold hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-wrap gap-5">
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-medical-accent hover:text-white transition-all" 
                    style={{ color: branding.primaryColor }}
                  >
                    Become a Donor
                  </button>
                  <button className="bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all backdrop-blur-md">Need Blood?</button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="font-black mb-8 uppercase text-xs tracking-[4px] text-slate-400">Inventory Status</h4>
          <div className="space-y-6">
            {['A+', 'B+', 'O-', 'AB+'].map(group => (
              <div key={group} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-700">{group}</span>
                  <span className="text-[10px] font-black text-medical-accent">High Reserve</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-medical-accent rounded-full" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-slate-400 mt-10 text-center font-bold italic border-t border-slate-50 pt-4">
          Live Sync • Updated 2 mins ago
        </div>
      </div>
    </div>
  </section>
  );
};

const TrackOrderModal = ({ onClose }: { onClose: () => void }) => {
  const [trackId, setTrackId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = () => {
    if(!trackId) return;
    setStatus("Order processed at Hub. Out for delivery.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-8 relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-[#1a2b4b] transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-medical-secondary p-3 rounded-xl border border-medical-accent/10">
              <ShoppingBag className="w-6 h-6 text-medical-accent" />
           </div>
           <h3 className="text-2xl font-black text-[#1a2b4b]">Track Shipment</h3>
        </div>
        <p className="text-slate-500 text-sm mb-8 font-medium italic">Monitor your medicines in real-time.</p>
        
        <div className="flex gap-2 mb-10">
          <input 
            type="text" 
            placeholder="CM-B123" 
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-medical-accent transition-all uppercase font-bold text-sm tracking-widest shadow-inner placeholder:italic placeholder:font-normal" 
          />
          <button onClick={handleTrack} className="bg-[#1a2b4b] text-white font-black px-6 rounded-xl hover:bg-medical-accent transition-all">
            Track
          </button>
        </div>
        
        {status && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-medical-secondary/50 border border-medical-accent/20 p-5 rounded-2xl flex items-start gap-4"
          >
            <div className="bg-white p-2 rounded-full border border-medical-accent/30 shadow-sm animate-bounce">
              <Clock className="w-4 h-4 text-medical-accent" />
            </div>
            <div>
              <p className="text-[#1a2b4b] font-black text-sm uppercase">Verification Phase</p>
              <p className="text-slate-500 text-xs mt-1 font-bold">{status}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const Products = ({ onSelectProduct, products }: { onSelectProduct: (p: Product) => void, products: Product[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, products]);

  return (
    <section id="products" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div>
          <h2 className="text-xs font-bold text-medical-accent uppercase tracking-[3px] mb-2">Health Store</h2>
          <h3 className="text-4xl font-bold text-[#1a2b4b]">Medicines & Wellness</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search medicines, skin care, baby products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-medical-accent transition-all text-sm shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat 
                ? "bg-medical-accent text-white medical-glow" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-medical-accent/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 26, scale: 0.96, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            whileHover={{ y: -8, rotateX: 2, rotateY: -2, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 130, damping: 17, delay: idx * 0.04 }}
            viewport={{ once: true }}
            onClick={() => onSelectProduct(product)}
            className="info-card flex flex-col group cursor-pointer hover:border-medical-accent/40 bg-white relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 -left-1/2 w-1/2 h-full bg-gradient-to-r from-transparent via-medical-accent/15 to-transparent"
              animate={{ x: ["-20%", "240%"] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: idx * 0.15, ease: "linear" }}
            />
            <div className="h-56 flex items-center justify-center bg-medical-secondary/30 rounded-xl mb-6 group-hover:bg-medical-secondary/50 transition-colors overflow-hidden">
              <motion.div
                className="text-medical-accent scale-150 transform group-hover:scale-[1.7] transition-transform duration-500 w-full h-full flex items-center justify-center"
                animate={{ rotate: [0, 2, 0, -2, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: idx * 0.08 }}
              >
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
                ) : (
                  product.icon || (product.iconName && ICON_MAP[product.iconName])
                )}
              </motion.div>
            </div>
            
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-[#1a2b4b] group-hover:text-medical-accent transition-colors leading-tight">{product.name}</h3>
                <motion.div
                  className="text-[10px] text-yellow-600 font-bold bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100 uppercase"
                  animate={{ rotate: [0, 3, 0, -3, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.05 }}
                >
                  ⭐ {product.rating}
                </motion.div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#3eb489] mb-4 block bg-medical-secondary/50 px-2 py-0.5 rounded w-fit">
                {product.category}
              </span>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xl font-bold text-[#1a2b4b] font-mono">Rs. {product.price.toLocaleString()}</div>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  className="bg-medical-accent/5 border border-medical-accent/20 text-medical-accent text-xs font-bold p-2.5 rounded-lg group-hover:bg-medical-accent group-hover:text-white transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="col-span-full py-20 text-center text-slate-400 font-medium italic">
          No medical products found matching your search.
        </div>
      )}
    </section>
  );
};

const SmartServices = () => (
  <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
    <div className="flex items-center gap-4 mb-20">
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-[6px] whitespace-nowrap italic">Smart Services</h2>
      <div className="h-[1px] w-full bg-slate-100"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      {[
        {
          title: "Upload Prescription",
          text: "Upload your doctor prescription and let our pharmacist verify medicines quickly.",
          icon: <FileText className="w-5 h-5" />,
          cta: "Upload Now"
        },
        {
          title: "Medicine Reminders",
          text: "Set refill reminders so your essential medicines are never missed.",
          icon: <BellRing className="w-5 h-5" />,
          cta: "Set Reminder"
        },
        {
          title: "Priority Delivery",
          text: "Get selected urgent medications delivered with faster handling.",
          icon: <Truck className="w-5 h-5" />,
          cta: "Enable Priority"
        },
        {
          title: "Pharmacist Chat",
          text: "Ask dosage and safety questions before placing your final order.",
          icon: <MessageCircle className="w-5 h-5" />,
          cta: "Start Chat"
        }
      ].map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: idx * 0.06 }}
          viewport={{ once: true }}
          whileHover={{ y: -6 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm"
        >
          <div className="bg-medical-secondary text-medical-accent w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
            {card.icon}
          </div>
          <h3 className="text-xl font-black text-[#1a2b4b] mb-3">{card.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">{card.text}</p>
          <button className="text-xs font-black uppercase tracking-widest text-medical-accent hover:text-[#1a2b4b] transition-colors">
            {card.cta}
          </button>
        </motion.div>
      ))}
    </div>
  </section>
);

const FloatingActions = ({ onTrackClick }: { onTrackClick: () => void }) => (
  <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[90] flex flex-col gap-3">
    <a href="tel:1122" className="bg-red-600 text-white px-4 py-3 rounded-2xl text-xs font-black tracking-widest uppercase shadow-xl shadow-red-300/40 hover:bg-red-700 transition-all hover:-translate-y-0.5">
      Emergency 1122
    </a>
    <button onClick={onTrackClick} className="bg-[#1a2b4b] text-white px-4 py-3 rounded-2xl text-xs font-black tracking-widest uppercase shadow-xl shadow-blue-900/20 hover:bg-medical-accent transition-all hover:-translate-y-0.5">
      Track Order
    </button>
  </div>
);

const HelpCenter = () => (
  <section id="help" className="py-24 px-6 max-w-7xl mx-auto">
    <div className="flex items-center gap-4 mb-20">
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-[6px] whitespace-nowrap italic">Support Center</h2>
      <div className="h-[1px] w-full bg-slate-100"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        viewport={{ once: true }}
        className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm"
      >
        <div className="bg-[#1a2b4b] w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/10">
          <HelpCircle className="w-6 h-6 text-medical-accent" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-8">Common Questions</h3>
        <div className="space-y-6">
          <details className="group border-b border-slate-100 pb-6">
            <summary className="font-bold cursor-pointer list-none flex justify-between items-center group-open:text-medical-accent transition-all text-[#1a2b4b]">
              How do I place an order?
              <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-slate-300" />
            </summary>
            <p className="mt-4 text-slate-500 text-sm italic font-medium">Select a product, view details, and click "Add to Order". Review your cart and provide delivery details.</p>
          </details>
          <details className="group border-b border-slate-100 pb-6">
            <summary className="font-bold cursor-pointer list-none flex justify-between items-center group-open:text-medical-accent transition-all text-[#1a2b4b]">
              Do I need a prescription?
              <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-slate-300" />
            </summary>
            <p className="mt-4 text-slate-500 text-sm italic font-medium">For scheduled drugs, our pharmacist will contact you to verify your prescription before delivery.</p>
          </details>
          <details className="group pb-2 text-[#1a2b4b]">
            <summary className="font-bold cursor-pointer list-none flex justify-between items-center group-open:text-medical-accent transition-all">
              What are the delivery charges?
              <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform text-slate-300" />
            </summary>
            <p className="mt-4 text-sm text-slate-500 italic font-medium">Delivery is free for orders above Rs. 2,000. For others, it is Rs. 150.</p>
          </details>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        viewport={{ once: true }}
        className="bg-medical-accent p-12 rounded-[40px] text-white relative overflow-hidden shadow-xl shadow-medical-accent/20"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Mail className="w-12 h-12 mb-8 drop-shadow-lg" />
          <h3 className="text-3xl font-black mb-6">Expert Support</h3>
          <p className="text-white/80 font-bold mb-10 text-lg leading-relaxed">Our pharmacists are ready to help. Reach out directly for medication queries or order assistance.</p>
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Email Assistance</span>
              <a href="mailto:abdulsamad465@clickmed.pk" className="text-2xl font-black hover:underline cursor-pointer">abdulsamad465@clickmed.pk</a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Helpline</span>
              <div className="text-2xl font-black">+92 21 34567890</div>
            </div>
          </div>
          <button className="mt-12 bg-[#1a2b4b] text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-2xl">
            Live Chat Now
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = ({ branding }: { branding: Branding }) => (
  <footer id="contact" className="bg-slate-50 border-t border-slate-100 pt-24 pb-12 px-6 mt-20">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-medical-accent p-2.5 rounded-xl shadow-lg shadow-medical-accent/20">
              <LogoIcon className="w-8 h-8 text-white" branding={branding} />
            </div>
            <span className="text-3xl font-black tracking-tighter" style={{ color: branding.primaryColor }}>
              {branding.name}<span style={{ color: branding.secondaryColor }}>{branding.accentTitle}</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
            Your trusted partner in healthcare. Delivering quality medicines and wellness products directly to your Pakistani household.
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-medical-accent hover:border-medical-accent cursor-pointer transition-all shadow-sm">
              <Twitter className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-medical-accent hover:border-medical-accent cursor-pointer transition-all shadow-sm">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-medical-accent hover:border-medical-accent cursor-pointer transition-all shadow-sm">
              <Facebook className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-12">
          <div>
            <h4 className="font-black mb-8 text-[11px] uppercase tracking-[4px] text-slate-400">Services</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><a href="#products" className="hover:text-medical-accent transition-colors">Pharmacy Store</a></li>
              <li><a href="#hospitals" className="hover:text-medical-accent transition-colors">Emergency Rescue</a></li>
              <li><a href="#blood" className="hover:text-medical-accent transition-colors">Blood Bank</a></li>
              <li><a href="#help" className="hover:text-medical-accent transition-colors">Order Tracking</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-[11px] uppercase tracking-[4px] text-slate-400">Resource</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><a href="#help" className="hover:text-medical-accent transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-medical-accent transition-colors">Partner Program</a></li>
              <li><a href="#" className="hover:text-medical-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-medical-accent transition-colors">Terms Conditions</a></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-black mb-8 text-[11px] uppercase tracking-[4px] text-slate-400">Headquarters</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-medical-secondary p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-medical-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Support</span>
                  <a href="mailto:abdulsamad465@clickmed.pk" className="text-slate-700 text-xs font-bold hover:text-medical-accent transition-colors">abdulsamad465@clickmed.pk</a>
                </div>
              </div>
              <div className="text-slate-400 text-[11px] leading-relaxed font-bold italic pt-4 border-t border-slate-200/50">
                <p>© 2026 ClickMeds. Designed for Better Health.</p>
                <p>PK Healthcare Certified.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const AdminPanel = ({ 
  branding, setBranding, 
  products, setProducts, 
  hospitals, setHospitals,
  stores, setStores
}: { 
  branding: Branding, setBranding: (b: Branding) => void, 
  products: Product[], setProducts: (p: Product[]) => void, 
  hospitals: any[], setHospitals: (h: any[]) => void,
  stores: any[], setStores: (s: any[]) => void
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'products' | 'facilities'>('branding');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean, status: string }>({ connected: false, status: 'Checking...' });
  const [stats, setStats] = useState({ orderCount: 0, donorCount: 0, productCount: 0 });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        console.log("Checking database status...");
        const res = await window.fetch('/api/db-status');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setDbStatus(data);
        
        const statsRes = await window.fetch('/api/admin/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (e) {
        console.error("Database status check failed:", e);
        setDbStatus({ connected: false, status: 'Offline / Error' });
      }
    };
    
    // Initial check after a small delay to allow server to wake up
    const timer = setTimeout(checkStatus, 3000);
    return () => clearTimeout(timer);
  }, []);

  const performSave = async (type: string, data: any) => {
    setIsSaving(true);
    setSaveStatus(`Saving ${type}...`);
    try {
      const endpoint = type === 'Branding' ? '/api/branding' : type === 'Inventory' ? '/api/products' : '/api/facilities';
      const body = type === 'Inventory' ? data : type === 'Facilities' ? { hospitals: data.hospitals, stores: data.stores } : data;
      
      const response = await window.fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Save failed');
      setSaveStatus(`${type} Saved!`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error(`${type} save failed:`, error);
      alert(`Failed to save ${type}.`);
      setSaveStatus(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncToCloud = async () => {
    setIsSaving(true);
    try {
      const response = await window.fetch('/api/seed', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branding, products, hospitals, stores })
      });
      if (!response.ok) throw new Error('Sync failed');
      alert('Changes saved to Cloud successfully!');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Failed to save changes. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveBranding = (field: keyof Branding, value: string) => {
    setBranding({ ...branding, [field]: value });
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: "New Product",
      price: 0,
      rating: 5.0,
      type: "Tablet",
      category: "Pharmacy",
      description: "Enter product description here.",
      image: "",
      iconName: "Thermometer"
    };
    setProducts([newProduct, ...products]);
    setEditingProduct(newProduct);
  };

  const handleDeleteProduct = (id: string | number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdateProduct = (id: string | number, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    if (editingProduct?.id === id) {
      setEditingProduct({ ...editingProduct, ...updates });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateProduct(editingProduct.id, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-medical-accent p-3 rounded-2xl">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1a2b4b]">Admin Control</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database: {dbStatus.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {saveStatus && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-medical-secondary px-4 py-2 rounded-lg text-medical-accent font-black text-xs uppercase tracking-widest border border-medical-accent/10"
              >
                {saveStatus}
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSyncToCloud}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#1a2b4b] text-white px-8 py-4 rounded-2xl font-black hover:bg-medical-accent transition-all disabled:opacity-50 shadow-xl shadow-blue-900/10"
          >
            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Saving...' : 'Save All to Cloud'}
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-12 border-b border-slate-100 pb-4">
        {[
          { id: 'branding', label: 'Store Branding', icon: <Camera className="w-4 h-4" /> },
          { id: 'products', label: 'Inventory Management', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'facilities', label: 'Local Facilities', icon: <MapPin className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-[#1a2b4b] text-white shadow-lg' : 'text-slate-400 hover:text-medical-accent'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Total Orders</span>
          <span className="text-3xl font-black text-[#1a2b4b]">{stats.orderCount}</span>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Products</span>
          <span className="text-3xl font-black text-[#1a2b4b]">{stats.productCount}</span>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Blood Donors</span>
          <span className="text-3xl font-black text-[#1a2b4b]">{stats.donorCount}</span>
        </div>
      </div>

      {activeTab === 'branding' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-[#1a2b4b] mb-8">Brand Identity</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store Main Name</label>
                <input 
                  type="text" value={branding.name} 
                  onChange={(e) => saveBranding('name', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-medical-accent font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accent Title</label>
                <input 
                  type="text" value={branding.accentTitle} 
                  onChange={(e) => saveBranding('accentTitle', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-medical-accent font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Tagline</label>
                <input 
                  type="text" value={branding.tagline} 
                  onChange={(e) => saveBranding('tagline', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-medical-accent font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Color (Navy)</label>
                  <input 
                    type="color" value={branding.primaryColor} 
                    onChange={(e) => saveBranding('primaryColor', e.target.value)}
                    className="w-full h-12 bg-transparent cursor-pointer rounded-xl overflow-hidden"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secondary Color (Green)</label>
                  <input 
                    type="color" value={branding.secondaryColor} 
                    onChange={(e) => saveBranding('secondaryColor', e.target.value)}
                    className="w-full h-12 bg-transparent cursor-pointer rounded-xl overflow-hidden"
                  />
                </div>
              </div>
              <button 
                onClick={() => performSave('Branding', branding)}
                disabled={isSaving}
                className="w-full bg-[#1a2b4b] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-medical-accent transition-all"
              >
                <Save className="w-5 h-5" /> Save Branding Changes
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200 p-12">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Live Preview</span>
             <BrandLogo branding={branding} className="scale-75" />
          </div>
        </motion.div>
      )}

      {activeTab === 'products' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#1a2b4b]">Inventory ({products.length})</h3>
            <div className="flex gap-4">
               <button 
                onClick={() => performSave('Inventory', products)}
                disabled={isSaving}
                className="bg-[#1a2b4b] text-white font-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-medical-accent transition-all text-sm"
              >
                <Save className="w-4 h-4" /> Save Inventory
              </button>
              <button 
                onClick={handleAddProduct}
                className="bg-medical-secondary text-medical-accent font-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-medical-accent/10 transition-all text-sm border border-medical-accent/20"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:border-medical-accent/30 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-medical-secondary p-3 rounded-xl text-medical-accent w-16 h-16 flex items-center justify-center overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      ICON_MAP[p.iconName || 'Thermometer']
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditingProduct(p)} className="p-2 rounded-lg bg-medical-secondary/50 text-medical-accent"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 rounded-lg bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h4 className="font-black text-slate-900 mb-1">{p.name}</h4>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-medical-accent italic">{p.category}</span>
                  <span className="text-[#1a2b4b]">Rs. {p.price}</span>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {editingProduct && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[40px] p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                  <button onClick={() => setEditingProduct(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-all"><X className="w-6 h-6" /></button>
                  <h3 className="text-2xl font-black text-[#1a2b4b] mb-10">Edit Product</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Name</label>
                        <input 
                          type="text" value={editingProduct.name} 
                          onChange={(e) => handleUpdateProduct(editingProduct.id, { name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Price (Rs.)</label>
                          <input 
                            type="number" value={editingProduct.price} 
                            onChange={(e) => handleUpdateProduct(editingProduct.id, { price: parseInt(e.target.value) || 0 })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">Rating</label>
                          <input 
                            type="number" step="0.1" value={editingProduct.rating} 
                            onChange={(e) => handleUpdateProduct(editingProduct.id, { rating: parseFloat(e.target.value) || 0 })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                        <select 
                          value={editingProduct.category} 
                          onChange={(e) => handleUpdateProduct(editingProduct.id, { category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none"
                        >
                          {["Pharmacy", "Skin Care", "Baby Care", "Mother Care", "Devices", "First Aid"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Product Image</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden relative group">
                            {editingProduct.image ? (
                              <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Camera className="w-6 h-6 text-slate-300" />
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-slate-400 font-bold mb-2">Upload a custom product photo from your device.</p>
                            <button className="text-[10px] font-black text-medical-accent uppercase hover:underline">Choose File</button>
                            {editingProduct.image && (
                              <button 
                                onClick={() => handleUpdateProduct(editingProduct.id, { image: '' })}
                                className="block mt-1 text-[10px] font-black text-red-500 uppercase hover:underline"
                              >
                                Remove Image
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                       <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                        <textarea 
                          rows={4} value={editingProduct.description} 
                          onChange={(e) => handleUpdateProduct(editingProduct.id, { description: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none resize-none text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Choose Icon</label>
                        <div className="grid grid-cols-5 gap-2">
                          {Object.keys(ICON_MAP).map(iconName => (
                            <button
                              key={iconName}
                              onClick={() => handleUpdateProduct(editingProduct.id, { iconName, icon: ICON_MAP[iconName] })}
                              className={`p-3 rounded-xl flex items-center justify-center transition-all ${editingProduct.iconName === iconName ? 'bg-medical-accent text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                              {ICON_MAP[iconName]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setEditingProduct(null)} className="mt-10 w-full bg-[#1a2b4b] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-medical-accent transition-all">
                    <Save className="w-5 h-5" /> Done Editing
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {activeTab === 'facilities' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-8">
              <h3 className="text-xl font-black text-[#1a2b4b] flex items-center gap-3">
                <Activity className="w-5 h-5 text-medical-accent" /> Hospital Stays
              </h3>
              <div className="space-y-4">
                {hospitals.map((h, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <input 
                        className="font-black text-slate-900 outline-none w-full bg-transparent"
                        value={h.name}
                        onChange={(e) => setHospitals(hospitals.map((hos, idx) => idx === i ? { ...hos, name: e.target.value } : hos))}
                      />
                      <input 
                        className="text-xs text-slate-400 outline-none w-full bg-transparent italic"
                        value={h.specialists}
                        onChange={(e) => setHospitals(hospitals.map((hos, idx) => idx === i ? { ...hos, specialists: e.target.value } : hos))}
                      />
                    </div>
                    <MapPin className="w-5 h-5 text-medical-accent/30" />
                  </div>
                ))}
              </div>
           </div>
           <div className="space-y-8">
              <h3 className="text-xl font-black text-[#1a2b4b] flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-medical-accent" /> Retail Pharmacies
              </h3>
              <div className="space-y-4">
                {stores.map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <input 
                        className="font-black text-slate-900 outline-none w-full bg-transparent"
                        value={s.name}
                        onChange={(e) => setStores(stores.map((sto, idx) => idx === i ? { ...sto, name: e.target.value } : sto))}
                      />
                      <input 
                        className="text-xs text-slate-400 outline-none w-full bg-transparent italic"
                        value={s.address}
                        onChange={(e) => setStores(stores.map((sto, idx) => idx === i ? { ...sto, address: e.target.value } : sto))}
                      />
                    </div>
                    <Phone className="w-5 h-5 text-medical-accent/30" />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => performSave('Facilities', { hospitals, stores })}
                disabled={isSaving}
                className="w-full bg-[#1a2b4b] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-medical-accent transition-all mt-8"
              >
                <Save className="w-5 h-5" /> Save All Facilities
              </button>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [branding, setBranding] = useState<Branding>({
    name: "Click",
    accentTitle: "Meds",
    tagline: "From Trusted Shelves to Your Doorstep",
    primaryColor: "#1a2b4b",
    secondaryColor: "#3eb489"
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [hospitals, setHospitals] = useState(DEFAULT_HOSPITALS);
  const [stores, setStores] = useState(DEFAULT_STORES);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [brandRes, prodRes, facRes] = await Promise.all([
          window.fetch('/api/branding'),
          window.fetch('/api/products'),
          window.fetch('/api/facilities')
        ]);
        
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          if (brandData && brandData.name) setBranding(brandData);
        }
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData && prodData.length > 0) setProducts(prodData);
        }
        
        if (facRes.ok) {
          const facData = await facRes.json();
          if (facData && facData.hospitals && facData.hospitals.length > 0) setHospitals(facData.hospitals);
          if (facData && facData.stores && facData.stores.length > 0) setStores(facData.stores);
        }
      } catch (error) {
        console.error('Initial fetch failed:', error);
      }
    };
    loadInitialData();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (product: CartItem, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === product.id) {
          const newQ = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQ };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  return (
    <main className={`selection:bg-medical-accent selection:text-black min-h-screen ${isDarkMode ? 'dark-theme' : ''}`}>
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onCartClick={() => setIsCheckoutOpen(true)} 
        onTrackClick={() => setIsTrackOpen(true)}
        branding={branding}
        isAdmin={isAdminMode}
        onToggleAdmin={() => setIsAdminMode(!isAdminMode)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
      />
      
      {isAdminMode ? (
        <AdminPanel 
          branding={branding} 
          setBranding={setBranding} 
          products={products} 
          setProducts={setProducts}
          hospitals={hospitals}
          setHospitals={setHospitals}
          stores={stores}
          setStores={setStores}
        />
      ) : (
        <>
          <Hero branding={branding} />
          <Products onSelectProduct={setSelectedProduct} products={products} />
          <SmartServices />
          <BloodDonationSection branding={branding} />
          
          {/* Information Sections */}
          <section id="hospitals" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-100 bg-white">
            <div className="flex items-center gap-4 mb-20">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[6px] whitespace-nowrap italic">Nearby Facilities</h2>
              <div className="h-[1px] w-full bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {hospitals.map((hospital, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="info-card flex flex-col justify-between bg-medical-secondary/30 border-medical-accent/5"
                >
                  <div>
                    <div className="font-black text-slate-900 mb-2 leading-tight">{hospital.name}</div>
                    <div className="text-[11px] text-slate-400 uppercase font-black tracking-widest">{hospital.specialists}</div>
                  </div>
                  <div className="flex items-center justify-between mt-10 pt-4 border-t border-medical-accent/10">
                    <span className="text-medical-accent font-black text-xs italic tracking-widest">{hospital.distance} away</span>
                    <MapPin className="w-4 h-4 text-medical-accent/30" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="stores" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-20">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[6px] whitespace-nowrap italic">Local Pharmacies</h2>
              <div className="h-[1px] w-full bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stores.map((store, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="info-card bg-slate-50 border-slate-200"
                >
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="font-black text-slate-900 mb-2">{store.name}</div>
                    <div className="text-xs text-slate-400 font-bold mb-6 italic">{store.address}</div>
                    <div className="flex items-center justify-between text-[11px] text-medical-accent font-black uppercase tracking-widest">
                       <span>{store.timing}</span>
                       <Phone className="w-4 h-4 text-medical-accent opacity-30" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <EmergencySection />

          <HelpCenter />
          <Footer branding={branding} />
          <FloatingActions onTrackClick={() => setIsTrackOpen(true)} />
        </>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={addToCart}
          />
        )}
        {isCheckoutOpen && (
          <CheckoutModal 
            cart={cart} 
            updateCart={updateCartQuantity}
            onClose={() => setIsCheckoutOpen(false)} 
            onFinish={(id) => { 
              setCart([]); 
              setLastOrderId(id); 
            }}
          />
        )}
        {isTrackOpen && (
          <TrackOrderModal onClose={() => setIsTrackOpen(false)} />
        )}
      </AnimatePresence>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}

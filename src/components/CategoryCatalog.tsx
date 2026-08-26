import React, { useState } from 'react';
import { 
  ArrowLeft, Star, ShoppingBag, ShieldCheck, Check, Search, ChevronRight,
  LayoutGrid, Camera, Video, HardDrive, Battery, Aperture, Mic, Briefcase, Shield
} from 'lucide-react';
import './CategoryCatalog.css';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  description: string;
  badge?: string;
  specs: string[];
}

export const CATEGORY_DATA: Record<string, { title: string; subtitle: string; icon: string; products: ProductItem[] }> = {
  'dji-cameras': {
    title: 'DJI Cameras',
    subtitle: 'Capture cinematic footage with top-tier DJI action and pocket cameras.',
    icon: '📷',
    products: [
      {
        id: 'dji-1',
        name: 'DJI Pocket 3',
        category: 'dji-cameras',
        price: '₹1,999/day',
        originalPrice: '₹2,500/day',
        rating: 4.9,
        reviews: 464,
        imageUrl: `${import.meta.env.BASE_URL}dji_pocket_3.png`,
        description: 'Compact 1-inch sensor camera with a rotatable screen and 3-axis gimbal.',
        badge: 'Trending',
        specs: ['1" CMOS Sensor', '4K/120fps', '3-Axis Stabilization']
      },
      {
        id: 'dji-2',
        name: 'DJI Creator Combo',
        category: 'dji-cameras',
        price: '₹3,282/day',
        rating: 4.8,
        reviews: 180,
        imageUrl: `${import.meta.env.BASE_URL}dji_creator_combo.png`,
        description: 'The ultimate creator kit including DJI Pocket 3, wireless mic, and battery handle.',
        specs: ['Includes Mic 2', 'Battery Handle', 'Mini Tripod']
      },
      {
        id: 'dji-3',
        name: 'DJI Osmo Action 4',
        category: 'dji-cameras',
        price: '₹900/day',
        rating: 4.8,
        reviews: 96,
        imageUrl: `${import.meta.env.BASE_URL}dji_action_4.png`,
        description: '1/1.3-inch sensor action camera delivering stunning low-light performance.',
        badge: '4K HDR',
        specs: ['1/1.3" Sensor', '4K/120fps', '155° Super-Wide FOV', 'Waterproof 18m']
      },
      {
        id: 'dji-4',
        name: 'DJI Action 5 Pro',
        category: 'dji-cameras',
        price: '₹1,200/day',
        rating: 5.0,
        reviews: 21,
        imageUrl: `${import.meta.env.BASE_URL}new_prod_3.png`,
        description: 'Next-generation flagship action camera featuring Subject Tracking and dual OLED screens.',
        badge: 'NEW RELEASE',
        specs: ['Dual OLED Touchscreens', 'Subject Tracking', '4-Hour Battery']
      }
    ]
  },
  'insta360-cameras': {
    title: 'Insta360 Cameras',
    subtitle: 'Shoot first, point later with ultimate 360-degree action cameras.',
    icon: '📸',
    products: [
      {
        id: 'insta-1',
        name: 'Insta360 X3 Action Camera',
        category: 'insta360-cameras',
        price: '₹800/day',
        rating: 4.9,
        reviews: 92,
        imageUrl: `${import.meta.env.BASE_URL}new_prod_1.png`,
        description: 'Dual-lens 5.7K 360-degree action camera with Invisible Selfie Stick mode.',
        specs: ['5.7K 360° Video', '10m Waterproof', 'Invisible Selfie Stick']
      },
      {
        id: 'insta-2',
        name: 'Insta360 X3 Creator Combo',
        category: 'insta360-cameras',
        price: '₹1,200/day',
        rating: 4.8,
        reviews: 45,
        imageUrl: `${import.meta.env.BASE_URL}insta360_x4.png`,
        description: 'Complete kit including bullet time cord, extra battery, and invisible selfie stick.',
        specs: ['Bullet Time Cord', 'Extra Battery', 'Lens Cap']
      }
    ]
  },
  'cameras': {
    title: 'Digital Cameras',
    subtitle: 'Professional digital cameras and point-and-shoots.',
    icon: '🎥',
    products: [
      {
        id: 'cam-digi',
        name: 'Digitek Digital Camera',
        category: 'cameras',
        price: '₹400/day',
        rating: 4.5,
        reviews: 12,
        imageUrl: `${import.meta.env.BASE_URL}digitek_cam.png`,
        description: 'Affordable and reliable digital camera for basic vlogging and photography.',
        specs: ['1080p Video', 'Compact Design', 'Built-in Flash']
      }
    ]
  },
  'memory-cards': {
    title: 'Memory Cards',
    subtitle: 'High-speed reliable storage for all your gear.',
    icon: '💾',
    products: [
      {
        id: 'mem-1',
        name: 'SanDisk 64GB Extreme Pro',
        category: 'memory-cards',
        price: '₹100/day',
        rating: 4.9,
        reviews: 120,
        imageUrl: `${import.meta.env.BASE_URL}sandisk_64.png`,
        description: 'Ultra-fast 64GB MicroSD card perfect for 4K video recording.',
        specs: ['64GB Capacity', '200MB/s Read', 'V30 Rating']
      },
      {
        id: 'mem-2',
        name: 'SanDisk 32GB High Endurance',
        category: 'memory-cards',
        price: '₹50/day',
        rating: 4.8,
        reviews: 89,
        imageUrl: `${import.meta.env.BASE_URL}sandisk_32.png`,
        description: 'Durable 32GB MicroSD designed for continuous recording.',
        specs: ['32GB Capacity', 'High Endurance', 'Waterproof']
      }
    ]
  },
  'camera-batteries': {
    title: 'Camera Batteries',
    subtitle: 'Never run out of juice on your adventures.',
    icon: '🔋',
    products: [
      {
        id: 'bat-1',
        name: 'Insta360 X3 Battery',
        category: 'camera-batteries',
        price: '₹150/day',
        rating: 4.9,
        reviews: 34,
        imageUrl: `${import.meta.env.BASE_URL}insta_battery.png`,
        description: 'Original Insta360 X3 rechargeable battery.',
        specs: ['1800mAh', 'Rechargeable']
      }
    ]
  },
  'lens': {
    title: 'Camera Lenses',
    subtitle: 'Premium lenses for every photography style.',
    icon: '🔍',
    products: []
  },
  'mics': {
    title: 'Microphones',
    subtitle: 'Crisp, clear audio for your videos and vlogs.',
    icon: '🎤',
    products: [
      {
        id: 'mic-1',
        name: 'DJI Mic (2 TX + 1 RX)',
        category: 'mics',
        price: '₹800/day',
        rating: 4.9,
        reviews: 210,
        imageUrl: `${import.meta.env.BASE_URL}dji_mic.png`,
        description: 'Compact, lightweight, and powerful wireless microphone system.',
        specs: ['250m Range', '15-Hour Battery', 'Magnetic Attachment']
      },
      {
        id: 'mic-2',
        name: 'Digitek Wireless Mic',
        category: 'mics',
        price: '₹300/day',
        rating: 4.6,
        reviews: 45,
        imageUrl: `${import.meta.env.BASE_URL}digitek_mic.png`,
        description: 'Affordable wireless mic system for smartphones and cameras.',
        specs: ['Plug & Play', 'Noise Cancellation']
      }
    ]
  },
  'camping-gear': {
    title: 'Camping Gear',
    subtitle: 'Everything you need for a night under the stars.',
    icon: '⛺',
    products: [
      {
        id: 'cg-1',
        name: '2-Person Camping Tent',
        category: 'camping-gear',
        price: '₹300/day',
        rating: 4.8,
        reviews: 45,
        imageUrl: `${import.meta.env.BASE_URL}tent.png`,
        description: 'Easy-to-setup 2-person tent.',
        specs: ['2-Person', 'Waterproof']
      },
      {
        id: 'cg-2',
        name: '3-Person Camping Tent',
        category: 'camping-gear',
        price: '₹400/day',
        rating: 4.7,
        reviews: 32,
        imageUrl: `${import.meta.env.BASE_URL}tent3.png`,
        description: 'Spacious 3-person family tent.',
        specs: ['3-Person', 'Waterproof']
      },
      {
        id: 'cg-3',
        name: 'Sleeping Bags',
        category: 'camping-gear',
        price: '₹100/day',
        rating: 4.9,
        reviews: 120,
        imageUrl: `${import.meta.env.BASE_URL}sleeping_bag.png`,
        description: 'Warm and comfortable sleeping bags.',
        specs: ['-5°C Rating']
      },
      {
        id: 'cg-4',
        name: 'Camping Tables',
        category: 'camping-gear',
        price: '₹200/day',
        rating: 4.5,
        reviews: 15,
        imageUrl: `${import.meta.env.BASE_URL}camping_table.png`,
        description: 'Foldable and lightweight camping table.',
        specs: ['Foldable', 'Aluminum']
      }
    ]
  },
  'riding-luggage': {
    title: 'Riding Luggage',
    subtitle: 'Secure and durable luggage for your bike.',
    icon: '🧳',
    products: [
      {
        id: 'rl-1',
        name: 'Riding Tank Bag',
        category: 'riding-luggage',
        price: '₹200/day',
        rating: 4.8,
        reviews: 23,
        imageUrl: `${import.meta.env.BASE_URL}tank_bag.png`,
        description: 'Magnetic tank bag for easy access.',
        specs: ['Magnetic', 'Waterproof']
      },
      {
        id: 'rl-2',
        name: 'Saddle Bags',
        category: 'riding-luggage',
        price: '₹350/day',
        rating: 4.9,
        reviews: 67,
        imageUrl: `${import.meta.env.BASE_URL}saddle_bag.png`,
        description: 'Spacious side saddle bags.',
        specs: ['Universal Fit']
      },
      {
        id: 'rl-3',
        name: 'Tail Bag',
        category: 'riding-luggage',
        price: '₹250/day',
        rating: 4.7,
        reviews: 41,
        imageUrl: `${import.meta.env.BASE_URL}tail_bag.png`,
        description: 'Secure tail bag for extra storage.',
        specs: ['Expandable']
      }
    ]
  },
  'backpacks': {
    title: 'Backpacks & Luggage',
    subtitle: 'Premium ergonomic, weather-resistant backpacks for travel.',
    icon: '🎒',
    products: [
      {
        id: 'bp-1',
        name: '60L Backpack',
        category: 'backpacks',
        price: '₹400/day',
        rating: 4.9,
        reviews: 89,
        imageUrl: `${import.meta.env.BASE_URL}backpacks/Amazon_com _ Mardingtop 28L Tactical Backpacks….jpg`,
        description: 'Large 60L capacity backpack for long treks.',
        specs: ['60L', 'Ergonomic']
      },
      {
        id: 'bp-2',
        name: '50L Backpack',
        category: 'backpacks',
        price: '₹300/day',
        rating: 4.8,
        reviews: 56,
        imageUrl: `${import.meta.env.BASE_URL}backpacks/Amazon_com _ Mardingtop 28L Tactical Backpacks….jpg`,
        description: 'Versatile 50L backpack for medium trips.',
        specs: ['50L', 'Lightweight']
      },
      {
        id: 'bp-3',
        name: 'Backpack Raincover',
        category: 'backpacks',
        price: '₹50/day',
        rating: 4.7,
        reviews: 120,
        imageUrl: `${import.meta.env.BASE_URL}backpacks/Amazon_com _ Mardingtop 28L Tactical Backpacks….jpg`,
        description: 'Waterproof cover to protect your backpack.',
        specs: ['Waterproof', 'Universal']
      }
    ]
  },
  'riding-gear': {
    title: 'Riding Gear',
    subtitle: 'CE-certified leather and textile armor jackets.',
    icon: '🧥',
    products: [
      {
        id: 'rj-1',
        name: 'Riding Jacket',
        category: 'riding-gear',
        price: '₹500/day',
        rating: 4.9,
        reviews: 58,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`,
        description: 'Premium riding jacket with CE level 2 armor.',
        badge: 'TOP RATED',
        specs: ['CE Armor Level 2', 'Thermal Liner']
      },
      {
        id: 'rj-2',
        name: 'Riding Pant',
        category: 'riding-gear',
        price: '₹400/day',
        rating: 4.8,
        reviews: 34,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`,
        description: 'Protective riding pants.',
        specs: ['CE Armor', 'Abrasion Resistant']
      },
      {
        id: 'rj-3',
        name: 'Riding Gloves',
        category: 'riding-gear',
        price: '₹150/day',
        rating: 4.9,
        reviews: 110,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`,
        description: 'Leather riding gloves with knuckle protection.',
        specs: ['Leather', 'Knuckle Guard']
      },
      {
        id: 'rj-4',
        name: 'Helmet',
        category: 'riding-gear',
        price: '₹300/day',
        rating: 4.9,
        reviews: 200,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`,
        description: 'DOT/ECE certified full-face helmet.',
        specs: ['DOT Certified', 'Pinlock Ready']
      },
      {
        id: 'rj-5',
        name: 'Riding Jacket Liner',
        category: 'riding-gear',
        price: '₹100/day',
        rating: 4.6,
        reviews: 20,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`,
        description: 'Thermal liner for riding jackets.',
        specs: ['Warm', 'Lightweight']
      },
      {
        id: 'rj-6',
        name: 'Rain Riding Jacket',
        category: 'riding-gear',
        price: '₹200/day',
        rating: 4.7,
        reviews: 45,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`,
        description: '100% waterproof rain jacket to wear over gear.',
        specs: ['Waterproof', 'Reflective']
      }
    ]
  }
};

const PHOTOGRAPHY_CATEGORIES: Array<{ key: string; label: string; icon: React.ReactNode; imageUrl?: string }> = [
  { key: 'photography-all', label: 'All Photography', icon: <LayoutGrid size={22} /> },
  { key: 'dji-cameras', label: 'DJI Cameras..', imageUrl: `${import.meta.env.BASE_URL}dji_pocket_3.png`, icon: <Camera size={22} /> },
  { key: 'insta360-cameras', label: 'Insta360 Cameras', imageUrl: `${import.meta.env.BASE_URL}new_prod_1.png`, icon: <Camera size={22} /> },
  { key: 'cameras', label: 'Cameras', imageUrl: `${import.meta.env.BASE_URL}digitek_cam.png`, icon: <Video size={22} /> },
  { key: 'memory-cards', label: 'Memory Cards', imageUrl: `${import.meta.env.BASE_URL}sandisk_64.png`, icon: <HardDrive size={22} /> },
  { key: 'camera-batteries', label: 'Batteries', imageUrl: `${import.meta.env.BASE_URL}insta_battery.png`, icon: <Battery size={22} /> },
  { key: 'lens', label: 'Lens', icon: <Aperture size={22} /> },
  { key: 'mics', label: 'Mics', imageUrl: `${import.meta.env.BASE_URL}dji_mic.png`, icon: <Mic size={22} /> }
];

const OUTDOOR_CATEGORIES: Array<{ key: string; label: string; icon: React.ReactNode; imageUrl?: string }> = [
  { key: 'outdoor-all', label: 'All Outdoor', icon: <LayoutGrid size={22} /> },
  { key: 'riding-gear', label: 'Riding Gear', imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`, icon: <Shield size={22} /> },
  { key: 'camping-gear', label: 'Camping Gear', icon: <Briefcase size={22} /> },
  { key: 'riding-luggage', label: 'Luggage', icon: <Briefcase size={22} /> },
  { key: 'backpacks', label: 'Backpacks', imageUrl: `${import.meta.env.BASE_URL}backpacks/Amazon_com _ Mardingtop 28L Tactical Backpacks….jpg`, icon: <Briefcase size={22} /> }
];

interface CategoryCatalogProps {
  categoryKey: string;
  onBack: () => void;
}

const CategoryCatalog: React.FC<CategoryCatalogProps> = ({ categoryKey, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('');
  
  React.useEffect(() => {
    if (categoryKey === 'photography' || categoryKey === 'photography-all') {
      setActiveCategory('photography-all');
    } else if (categoryKey === 'outdoor' || categoryKey === 'outdoor-all') {
      setActiveCategory('outdoor-all');
    } else {
      setActiveCategory(categoryKey || 'photography-all');
    }
  }, [categoryKey]);

  const parentCategory = ['outdoor', 'outdoor-all', 'riding-gear', 'camping-gear', 'riding-luggage', 'backpacks'].includes(activeCategory || categoryKey) ? 'outdoor' : 'photography';
  const sidebarCategories = parentCategory === 'outdoor' ? OUTDOOR_CATEGORIES : PHOTOGRAPHY_CATEGORIES;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  let displayedProducts: ProductItem[] = [];
  let currentCategoryInfo = null;

  if (activeCategory === 'photography-all') {
    PHOTOGRAPHY_CATEGORIES.slice(1).forEach(catInfo => {
      const cat = CATEGORY_DATA[catInfo.key];
      if (cat) displayedProducts = [...displayedProducts, ...cat.products];
    });
    currentCategoryInfo = {
      title: 'All Photography Rentals',
      subtitle: 'Browse all our available photography gear.',
      icon: '📸'
    };
  } else if (activeCategory === 'outdoor-all') {
    OUTDOOR_CATEGORIES.slice(1).forEach(catInfo => {
      const cat = CATEGORY_DATA[catInfo.key];
      if (cat) displayedProducts = [...displayedProducts, ...cat.products];
    });
    currentCategoryInfo = {
      title: 'All Outdoor Rentals',
      subtitle: 'Browse all our available outdoor gear.',
      icon: '⛺'
    };
  } else if (activeCategory === 'all') {
    Object.values(CATEGORY_DATA).forEach(cat => {
      displayedProducts = [...displayedProducts, ...cat.products];
    });
    currentCategoryInfo = {
      title: 'All Rentals',
      subtitle: 'Browse all our available gear and equipment.',
      icon: '✨'
    };
  } else {
    const cat = CATEGORY_DATA[activeCategory];
    if (cat) {
      displayedProducts = cat.products;
      currentCategoryInfo = cat;
    }
  }

  const filteredProducts = displayedProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    window.location.hash = `category/${key}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsBooked(false);
  };

  const confirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setSelectedProduct(null);
    }, 2500);
  };

  return (
    <div className="category-catalog-page">
      {/* Top Banner Navigation */}
      <div className="catalog-header-bar">
        <div className="container header-bar-content">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={18} /> BACK TO HOME
          </button>

          <div className="breadcrumb">
            <span onClick={onBack} className="crumb-link">Home</span>
            <ChevronRight size={14} />
            <span className="crumb-active">{currentCategoryInfo?.title || 'All'}</span>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="container catalog-layout">
        
        {/* LEFT SIDEBAR */}
        <aside className="catalog-sidebar">
          {sidebarCategories.map(cat => (
            <div 
              key={cat.key} 
              className={`sidebar-item ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.key)}
            >
              <div className="sidebar-icon">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.label} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                ) : (
                  cat.icon
                )}
              </div>
              <span className="sidebar-label">{cat.label}</span>
            </div>
          ))}
        </aside>

        {/* RIGHT CONTENT */}
        <div className="catalog-content">
          
          <div className="catalog-toolbar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${currentCategoryInfo?.title || 'rentals'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="catalog-filter-info">
              <span>Showing <strong>{filteredProducts.length}</strong> items</span>
            </div>
          </div>



          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your search or check back later for new gear!</p>
            </div>
          ) : (
            <div className="ecommerce-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="ecom-card">
                  {product.badge && <span className="card-badge">{product.badge}</span>}
                  
                  <div className="card-image-wrap">
                    <img src={product.imageUrl} alt={product.name} className="card-image" />
                  </div>

                  <div className="card-body">
                    <div className="card-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
                        ))}
                      </div>
                      <span className="rating-num">{product.rating}</span>
                      <span className="reviews-num">({product.reviews})</span>
                    </div>

                    <h3 className="card-title">{product.name}</h3>

                    <div className="card-specs">
                      {product.specs.slice(0,2).map((spec, i) => (
                        <span key={i} className="spec-tag">{spec}</span>
                      ))}
                    </div>

                    <div className="card-price-section">
                      <div className="price-box">
                        <span className="price-tag">{product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">{product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <button 
                      className="btn btn-primary rent-now-btn"
                      onClick={() => handleBookNow(product)}
                    >
                      <ShoppingBag size={16} /> RENT THIS ITEM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            {isBooked ? (
              <div className="success-booking">
                <div className="success-icon">
                  <Check size={36} />
                </div>
                <h2>Booking Confirmed!</h2>
                <p>You have reserved <strong>{selectedProduct.name}</strong>.</p>
                <p className="pickup-note">Our team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={confirmBooking} className="modal-form">
                <div className="modal-header">
                  <h2>Rent {selectedProduct.name}</h2>
                  <button type="button" className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
                </div>

                <div className="modal-product-summary">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
                  <div>
                    <h4>{selectedProduct.name}</h4>
                    <p className="modal-price">Price: <strong>{selectedProduct.price}</strong></p>
                    <span className="guarantee"><ShieldCheck size={14} /> Zero Security Deposit</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rental Start Date</label>
                    <input type="date" required />
                  </div>
                  <div className="form-group">
                    <label>Duration (Days)</label>
                    <input type="number" min="1" defaultValue="1" required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary confirm-btn">
                  CONFIRM RENTAL BOOKING
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCatalog;

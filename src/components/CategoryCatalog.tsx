import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, Check, Search, ChevronRight } from 'lucide-react';
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
  backpacks: {
    title: 'Backpacks & Tactical Luggage',
    subtitle: 'Premium ergonomic, weather-resistant backpacks for travel and adventure.',
    icon: '🎒',
    products: [
      {
        id: 'bp-1',
        name: 'Mardingtop 28L Tactical Backpack',
        category: 'backpacks',
        price: '500rs/day',
        originalPrice: '750rs/day',
        rating: 4.9,
        reviews: 42,
        imageUrl: `${import.meta.env.BASE_URL}backpacks/Amazon_com _ Mardingtop 28L Tactical Backpacks….jpg`,
        description: 'Heavy-duty 28L tactical backpack equipped with MOLLE webbing, hydration compartment, and reinforced weather protection.',
        badge: 'MOST POPULAR',
        specs: ['28L Capacity', 'Water Resistant 600D', 'MOLLE Attachment System', 'Hydration Compatible']
      },
      {
        id: 'bp-2',
        name: 'Herschel Little America Classic Backpack',
        category: 'backpacks',
        price: '500rs/day',
        originalPrice: '700rs/day',
        rating: 4.8,
        reviews: 35,
        imageUrl: `${import.meta.env.BASE_URL}backpacks/Herschel Supply Co_ Little America Backpack.jpg`,
        description: 'Iconic mountaineering style backpack with fleece-lined 15" laptop sleeve and magnetic strap closures.',
        badge: 'PREMIUM',
        specs: ['25L Capacity', '15" Padded Laptop Sleeve', 'Fleece-Lined', 'Air Mesh Back Padding']
      },
      {
        id: 'bp-3',
        name: 'Apex 24L Ergonomic Laptop Backpack',
        category: 'backpacks',
        price: '500rs/day',
        originalPrice: '650rs/day',
        rating: 4.7,
        reviews: 28,
        imageUrl: `${import.meta.env.BASE_URL}backpacks/Medium 24 L Laptop Backpack Apex (Black).jpg`,
        description: 'Sleek urban laptop backpack with anti-theft hidden pockets and ergonomic weight-distribution straps.',
        badge: 'BEST VALUE',
        specs: ['24L Capacity', 'Hidden Anti-Theft Pocket', 'Breathable Mesh', 'Organized Pockets']
      }
    ]
  },
  'riding-jackets': {
    title: 'Motorcycle Riding Jackets',
    subtitle: 'CE-certified leather and textile armor jackets for maximum safety.',
    icon: '🧥',
    products: [
      {
        id: 'rj-1',
        name: 'Alpinestars Leather Racing Jacket',
        category: 'riding-jackets',
        price: '500rs/day',
        originalPrice: '900rs/day',
        rating: 4.9,
        reviews: 58,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/alpinstar.jpg`,
        description: 'Premium full-grain leather sport jacket with CE level 2 shoulder and elbow protectors.',
        badge: 'TOP RATED',
        specs: ['1.3mm Genuine Leather', 'CE Armor Level 2', 'Thermal Removable Liner', 'Reflective Panels']
      },
      {
        id: 'rj-2',
        name: 'Büse Mille Sport Racing Jacket',
        category: 'riding-jackets',
        price: '500rs/day',
        originalPrice: '850rs/day',
        rating: 4.8,
        reviews: 31,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/buse_mille_jacket.jpg`,
        description: 'German-engineered sport racing jacket featuring titanium shoulder caps and aerodynamic back hump.',
        badge: 'PRO GRADE',
        specs: ['Titanium Sliders', 'Aerodynamic Hump', 'Pre-curved Sleeves', 'Airvent System']
      },
      {
        id: 'rj-3',
        name: 'Divine Moto Wear Leather Jacket',
        category: 'riding-jackets',
        price: '500rs/day',
        originalPrice: '800rs/day',
        rating: 4.7,
        reviews: 24,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/divine_moto_jacket.jpg`,
        description: 'Rugged vintage leather riding jacket designed for all-season cruiser and touring rides.',
        badge: 'RUGGED',
        specs: ['Hand-finished Leather', 'Removable Armor', 'Adjustable Waist', 'Multiple Zipped Pockets']
      },
      {
        id: 'rj-4',
        name: 'Dainese Racing Performance Jacket',
        category: 'riding-jackets',
        price: '500rs/day',
        originalPrice: '950rs/day',
        rating: 4.9,
        reviews: 64,
        imageUrl: `${import.meta.env.BASE_URL}riding_jackets/dainese_jacket.jpg`,
        description: 'Track-ready performance jacket crafted with D-Skin 2.0 leather and aluminum shoulder plates.',
        badge: 'FEATURED',
        specs: ['D-Skin 2.0 Leather', 'Aluminum Plates', 'Nanofeel Liner', 'Microelastic 2.0']
      }
    ]
  },
  cameras: {
    title: '4K & 360 Action Cameras',
    subtitle: 'Capture your extreme adventures in ultra-HD 4K & 5.7K resolution.',
    icon: '📷',
    products: [
      {
        id: 'cam-1',
        name: 'Insta360 X3 360° Action Camera',
        category: 'cameras',
        price: '500rs/day',
        originalPrice: '800rs/day',
        rating: 4.9,
        reviews: 92,
        imageUrl: `${import.meta.env.BASE_URL}new_prod_1.png`,
        description: 'Dual-lens 5.7K 360-degree action camera with Invisible Selfie Stick mode and FlowState stabilization.',
        badge: 'BESTSELLER',
        specs: ['5.7K 360° Video', '10m Waterproof', 'Invisible Selfie Stick', '2.29" Touch Screen']
      },
      {
        id: 'cam-2',
        name: 'DJI Osmo Action 4 Camera',
        category: 'cameras',
        price: '500rs/day',
        originalPrice: '750rs/day',
        rating: 4.8,
        reviews: 46,
        imageUrl: `${import.meta.env.BASE_URL}new_prod_2.png`,
        description: '1/1.3-inch sensor action camera delivering stunning low-light performance and 10-bit D-Log M color.',
        badge: '4K HDR',
        specs: ['1/1.3" Sensor', '4K/120fps', '155° Super-Wide FOV', 'Deep Waterproof 18m']
      },
      {
        id: 'cam-3',
        name: 'DJI Action 5 Pro Camera',
        category: 'cameras',
        price: '500rs/day',
        originalPrice: '850rs/day',
        rating: 5.0,
        reviews: 21,
        imageUrl: `${import.meta.env.BASE_URL}new_prod_3.png`,
        description: 'Next-generation flagship action camera featuring Subject Tracking, dual OLED screens, and 4-hour battery life.',
        badge: 'NEW RELEASE',
        specs: ['Dual OLED Touchscreens', 'Subject Tracking', '47GB Built-in Storage', '4-Hour Battery']
      }
    ]
  }
};

interface CategoryCatalogProps {
  categoryKey: string;
  onBack: () => void;
}

const CategoryCatalog: React.FC<CategoryCatalogProps> = ({ categoryKey, onBack }) => {
  const category = CATEGORY_DATA[categoryKey] || CATEGORY_DATA.backpacks;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  const filteredProducts = category.products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="crumb-active">{category.title}</span>
          </div>
        </div>
      </div>

      {/* Main Catalog Content */}
      <div className="container catalog-container">
        {/* Category Hero */}
        <div className="category-hero">
          <div className="hero-text">
            <span className="category-badge">{category.icon} RENTAL COLLECTION</span>
            <h1 className="category-main-title">{category.title}</h1>
            <p className="category-subtitle">{category.subtitle}</p>
          </div>

          <div className="category-stats-pills">
            <div className="stat-pill">
              <span className="stat-value">500rs/day</span>
              <span className="stat-label">Flat Daily Rate</span>
            </div>
            <div className="stat-pill">
              <span className="stat-value">Instant</span>
              <span className="stat-label">Availability Check</span>
            </div>
            <div className="stat-pill">
              <span className="stat-value">Sanitized</span>
              <span className="stat-label">Gear Assurance</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="catalog-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${category.title}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="catalog-filter-info">
            <span>Showing <strong>{filteredProducts.length}</strong> items for rent</span>
          </div>
        </div>

        {/* Product Cards Grid */}
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
                  <span className="reviews-num">({product.reviews} reviews)</span>
                </div>

                <h3 className="card-title">{product.name}</h3>
                <p className="card-description">{product.description}</p>

                <div className="card-specs">
                  {product.specs.map((spec, i) => (
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
                  <span className="price-unit">Includes Insurance</span>
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
                <p>You have reserved <strong>{selectedProduct.name}</strong> at <strong>{selectedProduct.price}</strong>.</p>
                <p className="pickup-note">Our team will contact you shortly for pickup / delivery details.</p>
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
                    <span className="guarantee"><ShieldCheck size={14} /> Zero Security Deposit Needed</span>
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
                  CONFIRM RENTAL BOOKING ({selectedProduct.price})
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

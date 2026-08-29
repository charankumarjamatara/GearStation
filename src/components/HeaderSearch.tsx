import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { CATEGORY_DATA, type ProductItem } from './CategoryCatalog';
import { useCartContext } from '../CartContext';
import { useDateContext } from '../DateContext';
import './HeaderSearch.css';

const HeaderSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addToCart } = useCartContext();
  const { startDate, endDate, totalDays, setIsDatePromptOpen } = useDateContext();
  const hasDates = startDate && endDate;

  // Flatten all products across all categories
  const allProducts = Object.values(CATEGORY_DATA).flatMap(cat => cat.products);

  // Focus input when opened
  // Removed focus effect since it's always open

  // Filter products when query changes
  useEffect(() => {
    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();
      const matches = allProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
      setResults(matches);
    } else {
      setResults([]);
    }
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const parsePrice = (priceStr: string) => {
    const numeric = priceStr.replace(/[^0-9]/g, '');
    return parseInt(numeric, 10);
  };

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasDates) {
      setIsDatePromptOpen(true);
      return;
    }
    const totalPrice = parsePrice(product.price) * totalDays;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      startDate,
      endDate,
      totalDays,
      totalPrice
    });
    setIsOpen(false);
  };

  return (
    <div className="header-search-wrapper" ref={containerRef}>
      <div className="header-search-active">
        <div className="header-search-bar">
          <Search size={16} className="search-bar-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search gear by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="header-search-input"
          />
          {query.length > 0 && (
            <button 
              className="search-close-btn" 
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {isOpen && query.trim().length > 0 && (
          <div className="header-search-dropdown">
            {results.length > 0 ? (
              <div className="search-dropdown-list">
                <div className="search-dropdown-header">
                  <span>Matching Gear ({results.length})</span>
                </div>
                  {results.slice(0, 6).map((product) => {
                    const priceNum = parsePrice(product.price);
                    return (
                      <div 
                        key={product.id} 
                        className="search-dropdown-item"
                        onClick={() => {
                          window.location.hash = `category/${product.category}`;
                          setIsOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={product.imageUrl} alt={product.name} className="search-item-thumb" />
                        <div className="search-item-details">
                          <h4 className="search-item-title">{product.name}</h4>
                          <span className={`search-item-price ${!hasDates ? 'price-blurred' : ''}`}>
                            {hasDates ? `₹${(priceNum * totalDays).toLocaleString('en-IN')} (${totalDays}d)` : product.price}
                          </span>
                        </div>
                        <button 
                          className="search-add-btn" 
                          onClick={(e) => handleAddToCart(product, e)}
                          title="Add to bag"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="search-dropdown-empty">
                  <p>No gear found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};

export default HeaderSearch;

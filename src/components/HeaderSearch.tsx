import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, ArrowRight } from 'lucide-react';
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

  const allProducts = Array.from(
    new Map(
      Object.values(CATEGORY_DATA).flatMap(cat => cat.products.map(p => [p.id, p]))
    ).values()
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();
      const matches = allProducts.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
      setResults(matches);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

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

  const formatPrice = (product: ProductItem): string => {
    if (!hasDates) return product.price;
    const baseP = parsePrice(product.price);
    const extraP = product.extraDayPrice ? parsePrice(product.extraDayPrice) : baseP;
    const totalPrice = baseP + (totalDays > 1 ? extraP * (totalDays - 1) : 0);
    return '\u20b9' + totalPrice.toLocaleString('en-IN') + ' (' + totalDays + 'd)';
  };

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasDates) { setIsDatePromptOpen(true); return; }
    const baseP = parsePrice(product.price);
    const extraP = product.extraDayPrice ? parsePrice(product.extraDayPrice) : baseP;
    const totalPrice = baseP + (totalDays > 1 ? extraP * (totalDays - 1) : 0);
    addToCart({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, startDate, endDate, totalDays, totalPrice });
  };

  const handleResultClick = (product: ProductItem) => {
    window.location.hash = 'category/' + product.category;
    setIsOpen(false);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="header-search-wrapper" ref={containerRef}>
      <div className="header-search-bar">
        <Search size={16} className="search-bar-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search gear by name, category or brand..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim().length > 0) setIsOpen(true); }}
          className="header-search-input"
        />
        {query.length > 0 && (
          <button className="search-clear-btn" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="header-search-dropdown">
          {results.length > 0 ? (
            <>
              <div className="search-dropdown-header">
                <span className="search-match-label">MATCHING GEAR ({results.length})</span>
                <button className="search-view-all-btn" onClick={() => setIsOpen(false)}>
                  View all results <ArrowRight size={12} />
                </button>
              </div>
              <div className="search-results-list">
                {results.slice(0, 6).map((product) => (
                  <div key={product.id} className="search-result-row" onClick={() => handleResultClick(product)}>
                    <img src={product.imageUrl} alt={product.name} className="search-result-thumb" />
                    <div className="search-result-info">
                      <span className="search-result-name">{product.name}</span>
                      <span className={'search-result-price' + (!hasDates ? ' price-blurred' : '')}>
                        {formatPrice(product)}
                      </span>
                    </div>
                    <button className="search-add-btn" onClick={(e) => handleAddToCart(product, e)} title="Add to bag">
                      <Plus size={12} /> Add
                    </button>
                  </div>
                ))}
              </div>
              <div className="search-footer-row" onClick={() => setIsOpen(false)}>
                <Search size={13} className="search-footer-icon" />
                <span>Search for "<strong>{query}</strong>" in all gear</span>
                <ArrowRight size={13} className="search-footer-arrow" />
              </div>
            </>
          ) : (
            <div className="search-no-results">
              <Search size={18} className="no-results-icon" />
              <p>No gear found for "<strong>{query}</strong>"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;

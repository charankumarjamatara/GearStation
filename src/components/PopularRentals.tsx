import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '../data/products';
import './PopularRentals.css';

interface PopularRentalsProps {
  onSelectProduct?: (productIdOrSlug: string) => void;
}

const PopularRentals: React.FC<PopularRentalsProps> = ({ onSelectProduct }) => {
  const baseProducts = [
    ALL_PRODUCTS['gp-2'],     // dji Action 5
    ALL_PRODUCTS['gp-1'],     // DJI action 4
    ALL_PRODUCTS['dji-1'],    // DJI Pocket 3
    ALL_PRODUCTS['gp-19'],    // dji Action 5 vlogging combo
    ALL_PRODUCTS['i360-1'],   // Insta 360 X4 Action Camera
    ALL_PRODUCTS['rg-1'],     // Men Riding jacket - level 2
    ALL_PRODUCTS['rg-5'],     // Axor Riding helmet
    ALL_PRODUCTS['tg-2']      // 50L Backpack
  ].filter(Boolean);

  // Triple set for seamless continuous loop
  const products = [...baseProducts, ...baseProducts, ...baseProducts];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // High precision float offset in pixels
  const offsetXRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const isInteractingRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const animIdRef = useRef<number | null>(null);
  const stepAnimIdRef = useRef<number | null>(null);

  // Continuous Hardware-Accelerated Animation Loop (60fps/120fps)
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const track = trackRef.current;
      if (track) {
        const singleSetWidth = track.scrollWidth / 3;

        if (singleSetWidth > 0) {
          while (offsetXRef.current >= singleSetWidth) {
            offsetXRef.current -= singleSetWidth;
          }
          while (offsetXRef.current < 0) {
            offsetXRef.current += singleSetWidth;
          }
        }

        // Auto-scroll continuously when not actively dragging or navigating with buttons
        if (!isPointerDownRef.current && !isInteractingRef.current) {
          // Continuous smooth speed (~50px per second, gently slowed to 15px/s on card hover)
          const speed = isHoveredRef.current ? 15 : 55;
          offsetXRef.current += speed * dt;
          track.style.transform = `translate3d(-${offsetXRef.current}px, 0, 0)`;
        }
      }

      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (stepAnimIdRef.current) cancelAnimationFrame(stepAnimIdRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Pointer Down (Desktop mouse click / Mobile touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (stepAnimIdRef.current) cancelAnimationFrame(stepAnimIdRef.current);

    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetXRef.current;
    isDraggingRef.current = false;

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  // Pointer Move (Drag motion)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - startXRef.current;

    if (!isDraggingRef.current && Math.abs(deltaX) > 4) {
      isDraggingRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (isDraggingRef.current && trackRef.current) {
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      let newOffset = dragStartOffsetRef.current - deltaX;

      if (singleSetWidth > 0) {
        while (newOffset >= singleSetWidth) newOffset -= singleSetWidth;
        while (newOffset < 0) newOffset += singleSetWidth;
      }

      offsetXRef.current = newOffset;
      trackRef.current.style.transform = `translate3d(-${newOffset}px, 0, 0)`;
    }
  };

  // Pointer Up (Drag release)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    isPointerDownRef.current = false;

    setTimeout(() => {
      isDraggingRef.current = false;
      setIsDragging(false);
    }, 60);

    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500);
  };

  // Prevent accidental card navigation during drag
  const handleCaptureClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Trackpad horizontal scroll support
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaX !== 0 ? e.deltaX : 0;
    if (Math.abs(delta) < 2) return;

    if (trackRef.current) {
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      let newOffset = offsetXRef.current + delta;

      if (singleSetWidth > 0) {
        while (newOffset >= singleSetWidth) newOffset -= singleSetWidth;
        while (newOffset < 0) newOffset += singleSetWidth;
      }

      offsetXRef.current = newOffset;
      trackRef.current.style.transform = `translate3d(-${newOffset}px, 0, 0)`;

      isInteractingRef.current = true;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = window.setTimeout(() => {
        isInteractingRef.current = false;
      }, 1500);
    }
  };

  // Smooth Manual Nav Step with Arrow Buttons
  const handleManualStep = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;

    if (stepAnimIdRef.current) cancelAnimationFrame(stepAnimIdRef.current);

    const singleSetWidth = track.scrollWidth / 3;
    const cardStep = 284;
    const start = offsetXRef.current;
    const target = direction === 'right' ? start + cardStep : start - cardStep;
    const change = target - start;
    const startTime = performance.now();
    const duration = 320;

    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

    const animateStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out

      let cur = start + change * ease;
      if (singleSetWidth > 0) {
        while (cur >= singleSetWidth) cur -= singleSetWidth;
        while (cur < 0) cur += singleSetWidth;
      }

      offsetXRef.current = cur;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${cur}px, 0, 0)`;
      }

      if (progress < 1) {
        stepAnimIdRef.current = requestAnimationFrame(animateStep);
      } else {
        resumeTimeoutRef.current = window.setTimeout(() => {
          isInteractingRef.current = false;
        }, 1800);
      }
    };

    stepAnimIdRef.current = requestAnimationFrame(animateStep);
  };

  return (
    <section id="rent-gear" className="section popular-rentals">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">POPULAR <span className="text-red">RENTALS</span></h2>
          <div className="popular-nav-arrows">
            <button 
              type="button"
              className="popular-nav-btn" 
              onClick={() => handleManualStep('left')}
              aria-label="Previous rentals"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              type="button"
              className="popular-nav-btn" 
              onClick={() => handleManualStep('right')}
              aria-label="Next rentals"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div 
          className={`carousel-wrapper ${isDragging ? 'is-dragging' : ''}`}
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onClickCapture={handleCaptureClick}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
        >
          <div className="products-carousel-track" ref={trackRef}>
            {products.map((product, index) => (
              <div className="carousel-item" key={index}>
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  extraDayPrice={product.extraDayPrice}
                  imageUrl={product.imageUrl}
                  onSelectProduct={onSelectProduct}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularRentals;

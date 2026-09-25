import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import categoryCharVideo from '../assets/cute_elements2.mp4';
import './Categories.css';

interface CategoriesProps {
  onSelectCategory?: (categoryKey: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.loop = false; // Master controller manages smooth exit fade and clean restart

    let isMounted = true;
    let restartTimer: any = null;
    let rafId: number | null = null;

    const checkFade = () => {
      if (!isMounted || !video) return;

      const t = video.currentTime;
      const duration = video.duration || 10.01;
      const exitDuration = 0.55; // ~500ms smooth motion-blur exit window
      const exitStart = duration - exitDuration;

      if (t < 0.3) {
        // Subtle soft fade-in on entry (100% sharp, 0px blur)
        video.style.opacity = `${Math.min(1, t / 0.3)}`;
        video.style.filter = 'brightness(1.06) contrast(1.05)';
      } else if (t > exitStart) {
        // Right-side exit zone: progressive motion-blur (0px -> 3.5px) + subtle fade-out (1 -> 0)
        const progress = Math.min(1, Math.max(0, (t - exitStart) / exitDuration));
        const blurAmount = (progress * 3.5).toFixed(2);
        const opacity = (1 - progress).toFixed(3);

        video.style.opacity = `${opacity}`;
        video.style.filter = `brightness(1.06) contrast(1.05) blur(${blurAmount}px)`;
      } else {
        // Normal walk: completely sharp (0px blur), 100% opaque
        video.style.opacity = '1';
        video.style.filter = 'brightness(1.06) contrast(1.05)';
      }

      if (t >= duration - 0.05 || video.ended) {
        handleCycleComplete();
        return;
      }

      rafId = requestAnimationFrame(checkFade);
    };

    const handleCycleComplete = () => {
      if (!isMounted || !video) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;

      // Fully invisible and reset filter before next cycle
      video.style.opacity = '0';
      video.style.filter = 'brightness(1.06) contrast(1.05)';
      video.pause();
      video.currentTime = 0;

      // Clean invisible pause before the next cycle begins
      restartTimer = setTimeout(() => {
        if (isMounted) {
          startCycle();
        }
      }, 300);
    };

    const startCycle = () => {
      if (!isMounted || !video) return;
      video.currentTime = 0;
      video.style.opacity = '0';
      video.style.filter = 'brightness(1.06) contrast(1.05)';
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isMounted) {
              if (rafId) cancelAnimationFrame(rafId);
              rafId = requestAnimationFrame(checkFade);
            }
          })
          .catch(() => {
            if (isMounted) {
              restartTimer = setTimeout(startCycle, 800);
            }
          });
      }
    };

    startCycle();

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (restartTimer) clearTimeout(restartTimer);
      if (video) {
        video.pause();
      }
    };
  }, []);

  const categories = [
    {
      name: 'Photography',
      categoryKey: 'photography',
      description: 'Cameras, lenses, drones, lighting & more.',
      imageUrl: `${import.meta.env.BASE_URL}new_prod_3.png`,
      number: '01',
    },
    {
      name: 'Outdoor Gear',
      categoryKey: 'outdoor',
      description: 'Backpacks, tripods, camping gear & essentials.',
      imageUrl: `${import.meta.env.BASE_URL}camera_backpack.png`,
      number: '02',
    }
  ];

  const handleCategoryClick = (categoryKey: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryKey);
    } else {
      window.location.hash = `category/${categoryKey}`;
    }
  };

  return (
    <section id="categories" className="section categories">
      <div className="container">
        <div className="section-header categories-header-new">
          <div className="header-text-container">
            <h2 className="section-title category-heading">
              <span className="category-heading-text">
                BROWSE BY <span className="text-red">CATEGORY</span>
              </span>
              <span className="category-animation" aria-hidden="true">
                <span className="category-character">
                  <video
                    ref={videoRef}
                    className="category-char-video"
                    src={categoryCharVideo}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </span>
              </span>
            </h2>
            <p className="section-subtitle">Find the right gear for every kind of adventure.</p>
          </div>
        </div>
        
        <div className="categories-grid-new">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-card-new"
              onClick={() => handleCategoryClick(category.categoryKey)}
            >
              <div className="card-content-left">
                <div className="card-number-wrapper">
                  <span className="card-number">{category.number}</span>
                  <div className="red-line"></div>
                </div>
                
                <h3 className="category-name-new">{category.name}</h3>
                <p className="category-desc-new">{category.description}</p>
                
                <div className="explore-link">
                  EXPLORE <ArrowRight size={16} />
                </div>
              </div>
              <div className="card-image-right">
                <img src={category.imageUrl} alt={category.name} className="category-img-new" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

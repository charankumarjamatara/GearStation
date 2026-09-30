import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import categoryCharVideo from '../assets/cute_elements2.mp4';
import './Categories.css';

interface CategoriesProps {
  onSelectCategory?: (categoryKey: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    let isMounted = true;
    let restartTimer: any = null;
    let isPlaying = false;
    let isInViewport = false;
    let rafId: number | null = null;
    const ENTRANCE_DURATION = 1.0; // 1.0s entrance walking duration

    const syncOpacityWithProgress = () => {
      if (!isMounted || !video) return;

      const t = video.currentTime;
      if (t < ENTRANCE_DURATION) {
        const p = Math.max(0, Math.min(t / ENTRANCE_DURATION, 1));
        // Smooth easing curve: progress 0.0 -> 0.0, 0.2 -> 0.20, 0.4 -> 0.45, 0.6 -> 0.70, 0.8 -> 0.90, 1.0 -> 1.0
        const opacity = 1 - Math.pow(1 - p, 1.8);
        video.style.opacity = Math.max(0, Math.min(opacity, 1)).toFixed(3);
      } else {
        video.style.opacity = '1';
      }

      if (isPlaying && !video.paused && !video.ended) {
        rafId = requestAnimationFrame(syncOpacityWithProgress);
      }
    };

    const playCycle = () => {
      if (!isMounted || !video) return;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      video.style.transition = 'none';
      video.style.opacity = '0';
      video.currentTime = 0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isMounted || !video) return;
            isPlaying = true;
            rafId = requestAnimationFrame(syncOpacityWithProgress);
          })
          .catch(() => {
            isPlaying = false;
          });
      }
    };

    const handleTimeUpdate = () => {
      if (!isMounted || !video) return;
      const t = video.currentTime;
      if (t < ENTRANCE_DURATION) {
        const p = Math.max(0, Math.min(t / ENTRANCE_DURATION, 1));
        const opacity = 1 - Math.pow(1 - p, 1.8);
        video.style.opacity = Math.max(0, Math.min(opacity, 1)).toFixed(3);
      } else {
        video.style.opacity = '1';
      }
    };

    const handleEnded = () => {
      if (!isMounted || !video) return;
      isPlaying = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      video.style.transition = 'opacity 0.4s ease';
      video.style.opacity = '0';

      // Settle pause of 4s before the next natural walking cycle
      restartTimer = setTimeout(() => {
        if (isMounted && isInViewport) {
          video.style.transition = 'none';
          video.style.opacity = '0';
          playCycle();
        }
      }, 4000);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInViewport = true;
            if (!isPlaying) {
              playCycle();
            }
          } else {
            isInViewport = false;
            if (restartTimer) {
              clearTimeout(restartTimer);
              restartTimer = null;
            }
            if (video && !video.paused) {
              video.pause();
              isPlaying = false;
              if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
              }
              video.style.transition = 'none';
              video.style.opacity = '0';
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
      }
    );

    observer.observe(section);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      isMounted = false;
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (restartTimer) clearTimeout(restartTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (video) video.pause();
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
    <section id="categories" ref={sectionRef} className="section categories">
      <div className="container">
        <div className="section-header categories-header-new">
          <div className="header-text-container">
            <h2 className="section-title category-heading">
              <span className="category-heading-text">
                BROWSE BY <span className="text-red">CATEGORY</span>
              </span>
              <span className="category-animation" aria-hidden="true">
                <video
                  ref={videoRef}
                  className="category-char-video"
                  src={categoryCharVideo}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                />
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

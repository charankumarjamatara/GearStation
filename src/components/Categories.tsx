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

    const playCycle = () => {
      if (!isMounted || !video) return;
      video.currentTime = 0;
      video.style.opacity = '1';

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
          })
          .catch(() => {
            isPlaying = false;
          });
      }
    };

    const handleEnded = () => {
      if (!isMounted || !video) return;
      isPlaying = false;
      video.style.opacity = '0';

      // Settle pause of 4s before the next natural walking cycle
      restartTimer = setTimeout(() => {
        if (isMounted && isInViewport) {
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

    return () => {
      isMounted = false;
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
      if (restartTimer) clearTimeout(restartTimer);
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

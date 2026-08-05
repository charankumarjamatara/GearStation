import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Categories.css';

interface CategoriesProps {
  onSelectCategory?: (categoryKey: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      name: 'ACTION CAMERAS',
      categoryKey: 'cameras',
      imageUrl: `${import.meta.env.BASE_URL}insta360_x4.png`,
    },
    {
      name: 'BACKPACKS',
      categoryKey: 'backpacks',
      imageUrl: `${import.meta.env.BASE_URL}camera_backpack.png`,
    },
    {
      name: 'BIKES',
      categoryKey: 'bikes',
      imageUrl: `${import.meta.env.BASE_URL}bike.png`,
    },
    {
      name: 'RIDING GEAR',
      categoryKey: 'riding-jackets',
      imageUrl: `${import.meta.env.BASE_URL}riding_jacket.png`,
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
        <div className="section-header">
          <h2 className="section-title">BROWSE BY CATEGORY</h2>
          <a 
            href="#category/backpacks" 
            onClick={(e) => { e.preventDefault(); handleCategoryClick('backpacks'); }} 
            className="view-all-link"
          >
            EXPLORE ALL CATEGORIES <ArrowRight size={16} />
          </a>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="category-card"
              onClick={() => handleCategoryClick(category.categoryKey)}
            >
              <img src={category.imageUrl} alt={category.name} className="category-bg-img" />
              <div className="category-overlay">
                <h3 className="category-name">{category.name}</h3>
                <ArrowRight className="category-arrow" size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;


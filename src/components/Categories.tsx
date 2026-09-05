import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Categories.css';

interface CategoriesProps {
  onSelectCategory?: (categoryKey: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
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
            <h2 className="section-title">BROWSE BY <span className="text-red">CATEGORY</span></h2>
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


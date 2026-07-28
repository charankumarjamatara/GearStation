import React from 'react';
import { Camera, Backpack, Bike, Shirt, ArrowRight } from 'lucide-react';
import './Categories.css';

const Categories: React.FC = () => {
  const categories = [
    {
      name: 'ACTION\nCAMERAS',
      icon: <Camera size={48} strokeWidth={1} />,
    },
    {
      name: 'CAMERAS',
      icon: <Backpack size={48} strokeWidth={1} />,
    },
    {
      name: 'BIKES',
      icon: <Bike size={48} strokeWidth={1} />,
    },
    {
      name: 'RIDING\nGEAR',
      icon: <Shirt size={48} strokeWidth={1} />,
    }
  ];

  return (
    <section id="categories" className="section categories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">BROWSE BY CATEGORY</h2>
          <a href="#" className="view-all-link">
            EXPLORE ALL CATEGORIES <ArrowRight size={16} />
          </a>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-content">
                <div className="category-icon">
                  {category.icon}
                </div>
                <h3 className="category-name">{category.name}</h3>
              </div>
              <ArrowRight className="category-arrow" size={20} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

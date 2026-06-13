import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/shop?category=${category.id}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 hover:-translate-y-1 duration-300">
        {/* Image */}
        <div className="aspect-square bg-amber-50 flex items-center justify-center overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-5xl">{category.emoji || '🎨'}</span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-800 text-sm">{category.name}</h3>
          {category.productCount && (
            <p className="text-xs text-gray-400 mt-1">{category.productCount} products</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
// chore: update 24 - 2026-06-10T14:20:49

// chore: update 37 - 2026-06-13T17:14:50

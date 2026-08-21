import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORY_INFO, getProductsByCategory } from '../lib/products';

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('featured');
  const currentCat = searchParams.get('cat') || 'all';

  const info = CATEGORY_INFO[currentCat];
  const title = info ? info.label : 'Shop All';
  const desc = info ? info.desc : 'The full Ophelia collection, Spring/Summer 2026.';

  const chips = [{ key: 'all', label: 'All' }, ...Object.entries(CATEGORY_INFO).map(([k, v]) => ({ key: k, label: v.label }))];

  let list = getProductsByCategory(currentCat).slice();
  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sort === 'newest') list.sort((a, b) => (b.badge === 'New') - (a.badge === 'New'));
  if (sort === 'best-selling') list.sort((a, b) => (b.badge === 'Bestseller') - (a.badge === 'Bestseller'));

  return (
    <main className="container">
      <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>{title}</span></div>

      <section style={{ paddingTop: 20 }}>
        <div className="section-head" style={{ textAlign: 'left', margin: '0 0 10px' }}>
          <h1 className="serif" style={{ fontSize: 34 }}>{title}</h1>
          <p className="section-sub" style={{ marginTop: 6 }}>{desc}</p>
        </div>

        <div className="filter-bar">
          <div className="chip-row">
            {chips.map((c) => (
              <button
                key={c.key}
                className={`chip${c.key === currentCat ? ' active' : ''}`}
                onClick={() => setSearchParams({ cat: c.key })}
              >
                {c.label}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Sort: Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>

        <div className="grid">
          {list.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              subtitle={`${p.sub} · ${p.variants.length} ${p.variantLabel.toLowerCase()}${p.variants.length > 1 ? 's' : ''}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

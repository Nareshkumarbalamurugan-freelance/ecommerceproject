import { useState } from 'react';
import { ArrowRight, Truck, Shield, RefreshCw, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-banner.jpg';

const Home = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const featuredProducts = products.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-r from-primary-light to-accent-light">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Shop Smart,
              <span className="text-accent"> Save More</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Discover amazing deals on fashion, electronics, and lifestyle products. 
              Free delivery across India!
            </p>
            <Button className="btn-accent text-lg px-8 py-4">
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
              <p className="text-muted-foreground">Free shipping on orders above ₹499</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">100% secure payment with BharatPe</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">7-day return policy on all products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold mb-4 sm:mb-0">Shop by Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'All Products' : category}
                </Button>
              ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-2xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                No products available in this category yet.
              </p>
              <Link to="/admin">
                <Button>Add Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                rating: 5,
                comment: "Amazing quality products at great prices! Fast delivery and excellent customer service."
              },
              {
                name: "Rahul Kumar",
                rating: 5,
                comment: "Love the variety of products available. The checkout process is super smooth."
              },
              {
                name: "Anita Singh", 
                rating: 4,
                comment: "Great shopping experience. The products arrived exactly as shown in pictures."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)]">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 italic">"{testimonial.comment}"</p>
                <p className="font-semibold text-primary">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
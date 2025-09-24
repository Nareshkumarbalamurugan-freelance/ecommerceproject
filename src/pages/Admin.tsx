import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, ShoppingCart, Users, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { useProducts } from '../hooks/useProducts';
import { Product, Order } from '../types';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    rating: '4.0',
    reviews: '0',
    inStock: true
  });

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: '',
      rating: '4.0',
      reviews: '0',
      inStock: true
    });
    setSelectedProduct(null);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({
        title: "Please fill required fields",
        description: "Name, price, and category are required.",
        variant: "destructive"
      });
      return;
    }

    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      image: productForm.image || '/placeholder.svg',
      category: productForm.category,
      rating: parseFloat(productForm.rating),
      reviews: parseInt(productForm.reviews),
      inStock: productForm.inStock,
      discount: productForm.originalPrice ? 
        Math.round(((parseFloat(productForm.originalPrice) - parseFloat(productForm.price)) / parseFloat(productForm.originalPrice)) * 100) : 
        0
    };

    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
      toast({
        title: "Product updated!",
        description: `${productData.name} has been updated successfully.`
      });
    } else {
      addProduct(productData);
      toast({
        title: "Product added!",
        description: `${productData.name} has been added to your store.`
      });
    }

    resetProductForm();
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      category: product.category,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      inStock: product.inStock
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      toast({
        title: "Product deleted",
        description: "Product has been removed from your store."
      });
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    saveOrders(updatedOrders);
    toast({
      title: "Order status updated",
      description: `Order ${orderId} is now ${status.toLowerCase()}.`
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Ongoing': return 'bg-blue-100 text-blue-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold">
                    ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products Management</TabsTrigger>
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products</CardTitle>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetProductForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            value={productForm.name}
                            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                            placeholder="Enter product name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                            placeholder="Product description"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price (₹) *</Label>
                            <Input
                              id="price"
                              type="number"
                              value={productForm.price}
                              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                              placeholder="0"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="originalPrice">Original Price (₹)</Label>
                            <Input
                              id="originalPrice"
                              type="number"
                              value={productForm.originalPrice}
                              onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Input
                            id="category"
                            value={productForm.category}
                            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                            placeholder="e.g., Men's Clothing, Electronics"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            value={productForm.image}
                            onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                              id="rating"
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={productForm.rating}
                              onChange={(e) => setProductForm({...productForm, rating: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="reviews">Reviews Count</Label>
                            <Input
                              id="reviews"
                              type="number"
                              value={productForm.reviews}
                              onChange={(e) => setProductForm({...productForm, reviews: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="inStock"
                            checked={productForm.inStock}
                            onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                          />
                          <Label htmlFor="inStock">In Stock</Label>
                        </div>

                        <Button type="submit" className="w-full">
                          {selectedProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                    <p className="text-muted-foreground">Add your first product to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Product</th>
                          <th className="text-left p-4">Category</th>
                          <th className="text-left p-4">Price</th>
                          <th className="text-left p-4">Stock</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {product.rating} ⭐ ({product.reviews} reviews)
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">{product.category}</td>
                            <td className="p-4">
                              <div>
                                <span className="font-semibold">₹{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                  <div className="text-sm text-muted-foreground line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={product.inStock ? "default" : "destructive"}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground">Orders will appear here once customers start purchasing.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Complete">Complete</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Customer Details</h4>
                            <p className="text-sm"><strong>Name:</strong> {order.customerName}</p>
                            <p className="text-sm"><strong>Phone:</strong> {order.customerPhone}</p>
                            <p className="text-sm"><strong>Address:</strong> {order.customerAddress}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Order Summary</h4>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm flex justify-between">
                                  <span>{item.product.name} x{item.quantity}</span>
                                  <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                              <div className="border-t pt-1 font-semibold flex justify-between">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
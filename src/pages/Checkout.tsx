import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Order } from '../types';
import bharatpeQR from '../assets/bharatpe-qr.jpg';

const Checkout = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryCharge = state.total > 499 ? 0 : 40;
  const finalTotal = state.total + deliveryCharge;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, phone, address, city, pincode, state: customerState } = customerInfo;
    if (!name || !phone || !address || !city || !pincode || !customerState) {
      toast({
        title: "Please fill all fields",
        description: "All delivery information fields are required.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!/^\d{10}$/.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
      toast({
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Create order
      const order: Order = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`,
        items: state.items,
        total: finalTotal,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Clear cart
      dispatch({ type: 'CLEAR_CART' });
      
      toast({
        title: "Order placed successfully! 🎉",
        description: `Order ID: ${order.id}. We'll contact you soon.`,
      });
      
      // Redirect to success page
      navigate('/order-success', { state: { orderId: order.id } });
      
    } catch (error) {
      toast({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/cart')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="House/Flat/Office No., Building Name, Street"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={customerInfo.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'qr' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setPaymentMethod('qr')}
                  >
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-medium">BharatPe QR Payment</h3>
                        <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Cash on Delivery</h3>
                        <p className="text-sm text-muted-foreground">Pay when you receive</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BharatPe QR Code */}
                {paymentMethod === 'qr' && (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <div className="mb-4">
                      <img
                        src={bharatpeQR}
                        alt="BharatPe QR Code"
                        className="w-48 h-48 mx-auto rounded-lg shadow-md"
                      />
                    </div>
                    <h3 className="font-semibold mb-2">Scan & Pay ₹{finalTotal.toLocaleString()}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan this QR code with any UPI app like GPay, PhonePe, Paytm, etc.
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Open any UPI app on your phone</p>
                      <p>• Scan the QR code above</p>
                      <p>• Complete the payment</p>
                      <p>• Place your order below</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="font-semibold text-sm">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{state.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-success' : ''}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  className="w-full btn-accent text-lg py-3 mt-6"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
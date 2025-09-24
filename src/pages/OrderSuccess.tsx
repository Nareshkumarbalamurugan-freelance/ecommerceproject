import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Clock, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-success mb-2">Order Placed Successfully! 🎉</h1>
            <p className="text-muted-foreground">
              Thank you for your order. We'll get it ready for delivery soon.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderId && (
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">Order ID</span>
                  <span className="font-mono text-sm bg-background px-3 py-1 rounded">
                    #{orderId.slice(-8)}
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">Order Status</p>
                    <p className="text-sm text-warning font-medium">Processing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      We'll call you within 2 hours to confirm your order details and delivery address.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-muted-foreground">
                      Your order will be packed and prepared for shipment within 24 hours.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Out for Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Your order will be delivered to your doorstep within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  If you have any questions about your order, feel free to contact us:
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1">
                    📞 Call Support
                  </Button>
                  <Button variant="outline" className="flex-1">
                    💬 Chat with Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="flex-1">
              <Button className="w-full btn-primary">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/admin" className="flex-1">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
          </div>

          {/* Footer Message */}
          <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              🎊 Thank you for choosing MeshCart! We appreciate your business and look forward to serving you again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
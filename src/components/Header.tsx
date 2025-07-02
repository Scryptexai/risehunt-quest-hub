import { Button } from '@/components/ui/button';
import { Wallet, Twitter, MessageCircle, Send } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-gradient-card border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6 py-8">
          {/* Logo and Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              RiseHunt
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Explore Risechain Ecosystem. Complete Tasks. Earn Badges.
            </p>
          </div>

          {/* Connection Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="wallet" size="lg" className="px-6">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
            
            <div className="flex gap-3">
              <Button variant="twitter" size="lg">
                <Twitter className="w-5 h-5" />
                Twitter
              </Button>
              
              <Button variant="discord" size="lg">
                <MessageCircle className="w-5 h-5" />
                Discord
              </Button>
              
              <Button variant="telegram" size="lg">
                <Send className="w-5 h-5" />
                Telegram
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
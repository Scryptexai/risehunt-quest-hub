import { Button } from '@/components/ui/button';
import { Twitter, MessageCircle, Send, Copy, ExternalLink, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gradient-card border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6 py-8">
          {/* Top Bar with Wallet Connection */}
          <div className="flex justify-between items-center">
            <div></div> {/* Spacer */}
            <div className="flex items-center space-x-4">
              {isConnected && (
                <div className="flex items-center space-x-2 bg-background/50 rounded-lg px-3 py-2 border border-primary/20">
                  <Wallet className="w-4 h-4 text-primary" />
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-mono">{formatAddress(address!)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://scan.risechain.net/address/${address}`, '_blank')}
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <ConnectButton />
            </div>
          </div>

          {/* Logo and Title */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              RiseHunt
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Explore Risechain Ecosystem. Complete Tasks. Earn Badges.
            </p>
          </div>

          {/* Social Buttons */}
          {isConnected && (
            <div className="flex flex-wrap justify-center gap-4">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
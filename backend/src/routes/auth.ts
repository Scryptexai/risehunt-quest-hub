import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { AuthRequest, authenticateToken } from '../middleware';
import { CacheService } from '../config/redis';

const router = Router();

// Verify wallet signature and generate JWT
router.post('/verify', async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    
    if (!address || !signature || !message) {
      return res.status(400).json({ error: 'Address, signature, and message are required' });
    }
    
    // Verify the signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid signature format' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: address.toLowerCase(),
        address: address.toLowerCase(),
        type: 'wallet'
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Store session in cache
    const sessionId = `session_${Date.now()}_${Math.random()}`;
    await CacheService.setSession(sessionId, address.toLowerCase(), {
      address: address.toLowerCase(),
      loginTime: new Date().toISOString()
    });
    
    // Track login activity
    await CacheService.trackUserActivity(address.toLowerCase(), 'wallet_login');
    
    res.json({
      success: true,
      token,
      user: {
        id: address.toLowerCase(),
        address: address.toLowerCase()
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get authentication challenge message
router.post('/challenge', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    // Generate a unique challenge message
    const timestamp = Date.now();
    const nonce = Math.random().toString(36).substring(2, 15);
    
    const message = `Welcome to Quest Platform!\n\nPlease sign this message to authenticate your wallet.\n\nAddress: ${address}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
    
    // Store challenge in cache (expires in 5 minutes)
    await CacheService.set(`challenge:${address}`, { message, timestamp }, 300);
    
    res.json({ message });
  } catch (error) {
    console.error('Challenge generation error:', error);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

// Logout and blacklist token
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Add token to blacklist (expires when token would expire)
      const decoded = jwt.decode(token) as any;
      const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
      
      if (expiryTime > 0) {
        await CacheService.set(`blacklist:${token}`, true, expiryTime);
      }
    }
    
    // Track logout activity
    await CacheService.trackUserActivity(req.user!.id, 'logout');
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // Generate new token
    const newToken = jwt.sign(
      { 
        id: userId,
        address: req.user!.address,
        type: 'wallet'
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Blacklist old token
    const oldToken = req.headers.authorization?.split(' ')[1];
    if (oldToken) {
      const decoded = jwt.decode(oldToken) as any;
      const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
      
      if (expiryTime > 0) {
        await CacheService.set(`blacklist:${oldToken}`, true, expiryTime);
      }
    }
    
    res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;
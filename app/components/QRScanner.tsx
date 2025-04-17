'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerProps {
  onClose: () => void;
  onScan: (result: string) => void;
}

const QRScanner = ({ onClose, onScan }: QRScannerProps) => {
  const scannerRef = useRef<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  useEffect(() => {
    // Create beep sound element
    beepRef.current = new Audio('/beep.mp3');
    beepRef.current.preload = 'auto';
    
    const initializeScanner = async () => {
      try {
        // Clean up any existing scanner instance
        if (scannerRef.current) {
          await scannerRef.current.clear();
          scannerRef.current = null;
        }

        const { Html5QrcodeScanner } = await import('html5-qrcode');
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
          },
          false
        );

        scannerRef.current.render(
          async (decodedText: string) => {
            setIsScanning(false);
            // Play beep sound only once per scan
            if (!hasPlayedSound && beepRef.current) {
              try {
                beepRef.current.currentTime = 0;
                await beepRef.current.play();
                setHasPlayedSound(true);
              } catch (error) {
                console.debug('Error playing beep:', error);
              }
            }
            
            if (scannerRef.current) {
              await scannerRef.current.clear();
              scannerRef.current = null;
            }
            onScan(decodedText);
          },
          (error: any) => {
            console.debug('QR scan error:', error);
          }
        );

        setIsScanning(true);
      } catch (error) {
        console.error('Error initializing scanner:', error);
        setIsScanning(false);
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [onScan, hasPlayedSound]);

  const handleClose = async () => {
    setIsScanning(false);
    if (scannerRef.current) {
      await scannerRef.current.clear();
      scannerRef.current = null;
    }
    onClose();
  };

  const toggleTorch = async () => {
    try {
      if (scannerRef.current?.getState()) {
        const html5QrCode = scannerRef.current.getState();
        if (torchOn) {
          await html5QrCode.stop();
          await html5QrCode.start({ facingMode: "environment" }, { fps: 10 }, () => {});
        } else {
          await html5QrCode.stop();
          await html5QrCode.start({ facingMode: "environment", torch: true }, { fps: 10 }, () => {});
        }
        setTorchOn(!torchOn);
      }
    } catch (error) {
      console.error('Error toggling torch:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[100] flex flex-col"
    >
      {/* Header */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-medium text-white">Scan QR Code</h2>
        </div>
        <button
          onClick={toggleTorch}
          className={`p-2 rounded-full transition-colors ${torchOn ? 'bg-white/20 text-yellow-400' : 'hover:bg-white/10 text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scanner Frame */}
            <div className="w-72 h-72 relative">
              {/* Corner Borders */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-sky-500"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-sky-500"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-sky-500"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-sky-500"></div>
              
              {/* Scanning Line */}
              {isScanning && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent animate-scanner"></div>
                </div>
              )}

              {/* Scan Effect */}
              {isScanning && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/10 to-transparent animate-scan-vertical"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* QR Reader Container */}
        <div id="qr-reader" className="w-full h-full"></div>
      </div>

      {/* Bottom Instructions */}
      <div className="relative z-20 px-4 py-6 bg-gradient-to-t from-black/80 to-transparent text-center">
        <p className="text-white/80 text-sm">
          Point your camera at a QR code or barcode
        </p>
      </div>
    </motion.div>
  );
};

export default QRScanner; 
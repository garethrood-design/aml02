import { useEffect, useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import DisableDevtool from 'disable-devtool';
import { NUMEROS } from '../numeros';
import { SETTINGS } from './settings';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [distance] = useState(() => Math.floor(Math.random() * (SETTINGS.distance.max - SETTINGS.distance.min + 1)) + SETTINGS.distance.min);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (window.innerWidth > 1200) {
      window.location.href = 'https://privacy-ana.vercel.app/';
      return;
    }

    DisableDevtool({
      disableMenu: true,
      disableSelect: true,
      disableCopy: true,
      disableCut: true,
      disablePaste: true,
      clearLog: true,
    });
  }, []);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (!showIntro && currentIndex < SETTINGS.fotos.length) {
      const swipeTimer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 800);

      return () => clearTimeout(swipeTimer);
    }

    if (currentIndex >= SETTINGS.fotos.length) {
      const redirectTimer = setTimeout(() => {
        const randomNumero = NUMEROS[Math.floor(Math.random() * NUMEROS.length)];
        const randomMessage = SETTINGS.messages[Math.floor(Math.random() * SETTINGS.messages.length)];
        const text = encodeURIComponent(randomMessage);
        window.location.href = `https://api.whatsapp.com/send?phone=${randomNumero}&text=${text}`;
      }, 1000);

      return () => clearTimeout(redirectTimer);
    }
  }, [currentIndex, showIntro]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 blur-lg"
      >
        <source src="https://filesjon.zapsafe.work/loira/videos/8.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-rose-950/20 to-black/70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_50%)]"></div>

      {showIntro && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-rose-950/80 to-black border border-rose-500/30 px-8 py-5 rounded-2xl shadow-2xl shadow-rose-500/20 animate-in zoom-in duration-500">
            <p className="text-rose-100 font-bold text-lg tracking-wide">
              {SETTINGS.name} {SETTINGS.introMessage}
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 mb-2 tracking-tight drop-shadow-lg">{SETTINGS.name}</h1>
          <div className="flex items-center justify-center gap-2 text-rose-200/80">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-medium">Apenas {distance} km de você</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-rose-300/70 mt-1">
            <Clock className="w-4 h-4 text-pink-400" />
            <span className="text-xs">{SETTINGS.onlineText}</span>
          </div>
        </div>

        <div className="relative w-full aspect-[3/4] perspective-1000">
          {SETTINGS.fotos.map((foto, index) => {
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;
            const rotation = (index - currentIndex) * 2;
            const scale = 1 - (index - currentIndex) * 0.05;
            const yOffset = (index - currentIndex) * 8;

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  isPast ? 'pointer-events-none' : ''
                }`}
                style={{
                  transform: isPast
                    ? 'translateX(150%) rotate(25deg) scale(0.8)'
                    : `translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
                  opacity: isPast ? 0 : Math.max(0.3, 1 - (index - currentIndex) * 0.2),
                  zIndex: SETTINGS.fotos.length - index,
                  transformOrigin: 'center center',
                }}
              >
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-rose-500/20 border-2 border-rose-500/20 bg-black">
                  <img
                    src={foto}
                    alt={`${SETTINGS.name} foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-rose-950/40 to-transparent"></div>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50"></div>
                        <span className="text-sm font-medium text-pink-300">{SETTINGS.availableText}</span>
                      </div>
                      <p className="text-2xl font-bold mb-1 text-rose-100">{SETTINGS.name}, {SETTINGS.age}</p>
                      <p className="text-rose-200/80 text-sm">{SETTINGS.status}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {SETTINGS.fotos.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index < currentIndex
                  ? 'bg-rose-500 w-8 shadow-lg shadow-rose-500/50'
                  : index === currentIndex
                  ? 'bg-pink-400 w-12 shadow-lg shadow-pink-400/50'
                  : 'bg-rose-950/50 w-6'
              }`}
            ></div>
          ))}
        </div>

        {currentIndex >= SETTINGS.fotos.length && (
          <div className="mt-8 text-center animate-in fade-in duration-500">
            <div className="bg-rose-950/60 backdrop-blur-md border border-rose-500/30 rounded-xl px-6 py-4 shadow-xl shadow-rose-500/20">
              <p className="text-rose-100 font-semibold mb-1">{SETTINGS.redirectingText}</p>
              <p className="text-rose-300/70 text-sm">{SETTINGS.connectingText} {SETTINGS.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-rose-500/40 text-xs">Todos os direitos reservados</p>
      </div>
    </div>
  );
}

export default App;

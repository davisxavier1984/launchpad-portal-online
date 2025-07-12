
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => setVideoLoaded(true);
      const handleError = () => {
        setVideoError(true);
        console.log('Video failed to load, using fallback image');
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-16 md:pt-24 md:pb-24 overflow-hidden"
    >
      {/* Background video with overlay */}
      <div className="absolute inset-0 z-0 hero-zoom">
        {/* Video background */}
        {!videoError && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-40' : 'opacity-0'
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/lovable-uploads/21e70c37-e204-4d4d-8e9a-0ab75565ee71.png"
          >
            <source src="/hero.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
        )}
        
        {/* Fallback image - sempre presente como base */}
        <div 
          className={`absolute inset-0 bg-[url('/lovable-uploads/21e70c37-e204-4d4d-8e9a-0ab75565ee71.png')] bg-center bg-cover bg-no-repeat transition-opacity duration-1000 ${
            videoLoaded && !videoError ? 'opacity-0' : 'opacity-30'
          }`}
        ></div>
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-brand-dark/90 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_rgba(0,194,255,0.8)_0,_rgba(255,255,255,0)_60%)] z-20"></div>
      </div>

      <div className="container mx-auto relative z-30 container-padding text-center">
        <div className="max-w-4xl mx-auto parallax-zoom">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white animate-fade-in-up text-zoom-scroll">
            A gente se importa com a Saúde do seu município.
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up text-zoom-scroll">
            Treinamento e consultoria especializada para Atenção Primária. Resolvemos todos os problemas relacionados ao sistema E-SUS AB.
          </p>
          <div className="flex flex-col items-center animate-fade-in-up">
            <Button 
              onClick={scrollToContact}
              className="bg-brand-gradient hover:opacity-90 transition-opacity text-base py-6 px-8 text-lg font-semibold"
            >
              AGENDE UMA VISITA
            </Button>
            
            <a 
              href="#contact" 
              className="mt-12 flex flex-col items-center text-white/70 hover:text-white transition-colors"
              aria-label="Scroll para contato"
            >
              <span className="text-sm mb-2">Saiba mais</span>
              <ChevronDown className="animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

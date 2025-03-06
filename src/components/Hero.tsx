
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-16 md:pt-24 md:pb-24 overflow-hidden"
    >
      {/* Background gradient with pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 z-0">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_rgba(0,194,255,0.8)_0,_rgba(255,255,255,0)_60%)]"></div>
      </div>

      {/* Animated shapes */}
      <div className="absolute top-1/3 right-[10%] w-64 h-64 rounded-full bg-brand-light/10 blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-1/4 left-[5%] w-96 h-96 rounded-full bg-brand-medium/10 blur-3xl animate-pulse-soft"></div>

      <div className="container mx-auto relative z-10 container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col text-center lg:text-left animate-fade-in-up">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-light/10 text-brand-dark font-medium text-sm mb-6">
              Inovação em Gestão de Saúde e Educação
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Soluções inteligentes para a gestão do seu{" "}
              <span className="gradient-text">futuro</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl lg:max-w-none">
              Transformamos dados em estratégias. Oferecemos sistemas integrados e
              consultoria especializada para potencializar seus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-brand-gradient hover:opacity-90 transition-opacity text-base py-6 px-8">
                Conheça Nossas Soluções
              </Button>
              <Button variant="outline" className="border-brand-light text-brand-dark hover:bg-brand-light/10 transition-colors py-6 px-8">
                Agende uma Demonstração
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square animate-float">
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30">
                <div className="p-8 h-full flex flex-col">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div className="bg-brand-gradient rounded-lg h-full"></div>
                    <div className="bg-brand-gradient/80 rounded-lg h-full"></div>
                    <div className="bg-brand-gradient/60 rounded-lg h-full"></div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-brand-light rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 animate-pulse-soft">
              <div className="transform -rotate-12">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21H4.6C3.1 21 2 19.9 2 18.4V4" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 7L16 2L11 7" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V14" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce hidden md:flex" onClick={scrollToServices}>
          <ChevronDown className="text-brand-dark h-8 w-8" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

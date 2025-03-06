
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-16 md:pt-24 md:pb-24 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-brand-dark/90 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-[url('/lovable-uploads/21e70c37-e204-4d4d-8e9a-0ab75565ee71.png')] bg-center bg-cover bg-no-repeat opacity-30"></div>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_rgba(0,194,255,0.8)_0,_rgba(255,255,255,0)_60%)]"></div>
      </div>

      <div className="container mx-auto relative z-10 container-padding text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white animate-fade-in-up">
            A gente se importa com a Saúde do seu município.
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Treinamento e consultoria especializada para Atenção Primária. Resolvemos todos os problemas relacionados ao sistema E-SUS AB.
          </p>
          <div className="flex justify-center animate-fade-in-up">
            <Button className="bg-brand-gradient hover:opacity-90 transition-opacity text-base py-6 px-8 text-lg font-semibold">
              AGENDE UMA VISITA
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

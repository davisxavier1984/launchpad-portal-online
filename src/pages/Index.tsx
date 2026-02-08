import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Benefits from "@/components/Benefits";
import News from "@/components/News";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useScrollAnimations } from "@/hooks/useScrollAnimations";

const Index = () => {
  useScrollAnimations();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

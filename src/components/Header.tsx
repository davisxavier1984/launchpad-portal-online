
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Início", href: "#home" },
    { name: "Serviços", href: "#services" },
    { name: "Benefícios", href: "#benefits" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between container-padding">
        <a href="#" className="flex items-center">
          <img
            src="/lovable-uploads/21e70c37-e204-4d4d-8e9a-0ab75565ee71.png"
            alt="Mais Gestor Logo"
            className="h-[240px] md:h-[240px]" /* Increased to exactly 240px */
          />
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-brand-medium font-medium transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-brand-gradient hover:opacity-90 transition-opacity">
            Fale Conosco
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center text-gray-700"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col container-padding py-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-brand-medium font-medium py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-brand-gradient hover:opacity-90 transition-opacity w-full mt-4">
            Fale Conosco
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

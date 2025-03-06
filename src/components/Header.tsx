
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

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

  const toggleSubmenu = (submenu: string) => {
    if (activeSubmenu === submenu) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(submenu);
    }
  };

  const navLinks = [
    { name: "INÍCIO", href: "#home" },
    { 
      name: "SERVIÇOS", 
      href: "#services",
      hasSubmenu: true,
      submenu: [
        { name: "CONSULTORIA", href: "#consultoria" },
        { name: "HOSPEDAGEM E SUPORTE", href: "#hospedagem" },
        { name: "ATENDIMENTO ESPECIALIZADO", href: "#atendimento" },
        { name: "APLICATIVOS", href: "#aplicativos" }
      ]
    },
    { name: "SOBRE", href: "#about" },
    { name: "INDICADORES DE DESEMPENHO", href: "#indicators" },
    { name: "CONTATO", href: "#contact" },
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
            className="h-16 md:h-20"
          />
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.hasSubmenu ? (
                <div className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-brand-medium font-medium transition-colors duration-200">
                  <a href={link.href}>{link.name}</a>
                  <ChevronDown size={16} className="group-hover:text-brand-medium" />
                </div>
              ) : (
                <a
                  href={link.href}
                  className="text-gray-700 hover:text-brand-medium font-medium transition-colors duration-200"
                >
                  {link.name}
                </a>
              )}

              {link.hasSubmenu && link.submenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:block z-50">
                  <div className="py-2">
                    {link.submenu.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-medium"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button className="bg-brand-gradient hover:opacity-90 transition-opacity ml-2">
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
          isMenuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col container-padding py-4 space-y-4">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col">
              <div className="flex justify-between items-center">
                <a
                  href={link.href}
                  className="text-gray-700 hover:text-brand-medium font-medium py-2 transition-colors duration-200"
                  onClick={() => {
                    if (!link.hasSubmenu) {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  {link.name}
                </a>
                {link.hasSubmenu && (
                  <button
                    onClick={() => toggleSubmenu(link.name)}
                    className="p-2"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        activeSubmenu === link.name ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
              {link.hasSubmenu && link.submenu && (
                <div
                  className={`pl-4 overflow-hidden transition-all duration-300 ${
                    activeSubmenu === link.name ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  {link.submenu.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      className="block py-2 text-gray-600 hover:text-brand-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
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

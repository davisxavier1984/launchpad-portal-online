
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useMenu } from "@/hooks/useMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { getActiveMenuItems, loading } = useMenu();

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

  const navLinks = getActiveMenuItems();

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md py-3">
        <div className="container mx-auto flex items-center justify-between container-padding">
          <a href="#" className="flex items-center">
            <img
              src="/lovable-uploads/21e70c37-e204-4d4d-8e9a-0ab75565ee71.png"
              alt="Mais Gestor Logo"
              className="h-16 md:h-20"
            />
          </a>
          <div className="animate-pulse">Carregando...</div>
        </div>
      </header>
    );
  }

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
            <div key={link.id} className="relative group">
              {link.hasSubmenu ? (
                <div className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-brand-medium font-medium transition-colors duration-200 py-2">
                  <a href={link.href} className="hover:text-brand-medium">{link.name}</a>
                  <ChevronDown size={16} className="group-hover:text-brand-medium transition-transform group-hover:rotate-180 duration-200" />
                </div>
              ) : (
                <a
                  href={link.href}
                  className="text-gray-700 hover:text-brand-medium font-medium transition-colors duration-200 py-2"
                >
                  {link.name}
                </a>
              )}

              {link.hasSubmenu && link.submenu && link.submenu.length > 0 && (
                <div className="absolute left-0 top-full w-64 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200 mt-1">
                  <div className="py-2">
                    {link.submenu.map((subItem) => (
                      <a
                        key={subItem.id}
                        href={subItem.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-medium transition-colors duration-150"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
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
            <div key={link.id} className="flex flex-col">
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
              {link.hasSubmenu && link.submenu && link.submenu.length > 0 && (
                <div
                  className={`pl-4 overflow-hidden transition-all duration-300 ${
                    activeSubmenu === link.name ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  {link.submenu.map((subItem) => (
                    <a
                      key={subItem.id}
                      href={subItem.href}
                      className="block py-2 text-gray-600 hover:text-brand-medium transition-colors duration-150"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

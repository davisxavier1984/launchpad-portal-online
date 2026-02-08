
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenu } from "@/hooks/useMenu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const { getActiveMenuItems, loading } = useMenu();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (submenu: string) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  // Desktop dropdown handlers (hover + keyboard)
  const openDropdown = useCallback((id: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDesktopDropdown(id);
  }, []);

  const closeDropdown = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDesktopDropdown(null);
    }, 150);
  }, []);

  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent, linkId: string, hasSubmenu: boolean) => {
      if (!hasSubmenu) return;

      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openDropdown(linkId);
      } else if (e.key === "Escape") {
        setOpenDesktopDropdown(null);
      }
    },
    [openDropdown]
  );

  const handleSubmenuKeyDown = useCallback(
    (e: React.KeyboardEvent, _items: { id: string }[], currentIndex: number) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = e.currentTarget.parentElement?.querySelector<HTMLAnchorElement>(
          `[data-index="${currentIndex + 1}"]`
        );
        next?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = e.currentTarget.parentElement?.querySelector<HTMLAnchorElement>(
          `[data-index="${currentIndex - 1}"]`
        );
        prev?.focus();
      } else if (e.key === "Escape") {
        setOpenDesktopDropdown(null);
      }
    },
    []
  );

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
          <nav className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </nav>
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
        <nav className="hidden md:flex items-center gap-6" role="menubar">
          {navLinks.map((link) => (
            <div
              key={link.id}
              className="relative"
              onMouseEnter={() => link.hasSubmenu && openDropdown(link.id)}
              onMouseLeave={closeDropdown}
            >
              {link.hasSubmenu ? (
                <button
                  type="button"
                  className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-brand-medium font-medium transition-colors duration-200 py-2 bg-transparent border-none"
                  aria-expanded={openDesktopDropdown === link.id}
                  aria-haspopup="true"
                  onKeyDown={(e) => handleDropdownKeyDown(e, link.id, true)}
                  onFocus={() => openDropdown(link.id)}
                  onBlur={closeDropdown}
                >
                  {link.name}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      openDesktopDropdown === link.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <a
                  href={link.href}
                  className="text-gray-700 hover:text-brand-medium font-medium transition-colors duration-200 py-2"
                  role="menuitem"
                >
                  {link.name}
                </a>
              )}

              {link.hasSubmenu && link.submenu && link.submenu.length > 0 && (
                <div
                  className={`absolute left-0 top-full w-64 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 z-50 border border-gray-200 mt-1 ${
                    openDesktopDropdown === link.id
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                  role="menu"
                  aria-label={`${link.name} submenu`}
                  onMouseEnter={() => openDropdown(link.id)}
                  onMouseLeave={closeDropdown}
                >
                  <div className="py-2">
                    {link.submenu.map((subItem, index) => (
                      <a
                        key={subItem.id}
                        href={subItem.href}
                        data-index={index}
                        role="menuitem"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-medium transition-colors duration-150 focus:bg-gray-100 focus:text-brand-medium focus:outline-none"
                        onKeyDown={(e) =>
                          handleSubmenuKeyDown(e, link.submenu!, index)
                        }
                        onBlur={closeDropdown}
                        onFocus={() => openDropdown(link.id)}
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
          aria-expanded={isMenuOpen}
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
        <nav className="flex flex-col container-padding py-4 space-y-4" role="menu">
          {navLinks.map((link) => (
            <div key={link.id} className="flex flex-col">
              <div className="flex justify-between items-center">
                <a
                  href={link.href}
                  className="text-gray-700 hover:text-brand-medium font-medium py-2 transition-colors duration-200"
                  role="menuitem"
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
                    aria-expanded={activeSubmenu === link.name}
                    aria-label={`Expandir ${link.name}`}
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        activeSubmenu === link.name ? "rotate-180" : ""
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
                  role="menu"
                >
                  {link.submenu.map((subItem) => (
                    <a
                      key={subItem.id}
                      href={subItem.href}
                      className="block py-2 text-gray-600 hover:text-brand-medium transition-colors duration-150"
                      role="menuitem"
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

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/atoms/Container";
import Logo from "@/components/atoms/Logo";
import Button from "@/components/atoms/Button";
import NavLink from "@/components/molecules/NavLink";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import navigationService from "@/services/api/navigationService";

export default function Header() {
  const [navLinks, setNavLinks] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadNavigation();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadNavigation = async () => {
    try {
      const data = await navigationService.getAll();
      setNavLinks(data);
    } catch (error) {
      console.error("Failed to load navigation:", error);
    }
  };

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.Id} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:block">
            <Button size="md">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </nav>
      </Container>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 p-6"
            >
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-700 hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.Id}
                    href={link.href}
                    onClick={handleMobileNavClick}
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <Button size="md" className="mt-4 w-full">
                  Get Started
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
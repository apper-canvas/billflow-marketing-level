import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import navigationService from "@/services/api/navigationService";
import footerService from "@/services/api/footerService";

export default function Layout() {
  const [navLinks, setNavLinks] = useState([]);
  const [footerData, setFooterData] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadNavigation();
    loadFooterData();
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

  const loadFooterData = async () => {
    try {
      const data = await footerService.getAll();
      setFooterData(data);
    } catch (error) {
      console.error("Failed to load footer data:", error);
    }
  };

  const outletContext = {
    navLinks,
    footerData,
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  };

  return (
    <div className="min-h-screen">
      <Header navLinks={navLinks} isScrolled={isScrolled} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <main>
        <Outlet context={outletContext} />
      </main>
      <Footer footerData={footerData} />
    </div>
  );
}
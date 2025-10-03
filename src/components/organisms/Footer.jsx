import { useState, useEffect } from "react";
import Container from "@/components/atoms/Container";
import Logo from "@/components/atoms/Logo";
import FooterColumn from "@/components/molecules/FooterColumn";
import ApperIcon from "@/components/ApperIcon";
import footerService from "@/services/api/footerService";

export default function Footer() {
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const data = await footerService.getAll();
      setFooterData(data);
    } catch (error) {
      console.error("Failed to load footer data:", error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo className="[&_span]:text-white" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Smart billing made simple. Automate your invoicing and get paid
              faster with BillFlow.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Twitter"
              >
                <ApperIcon name="Twitter" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="LinkedIn"
              >
                <ApperIcon name="Linkedin" className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="GitHub"
              >
                <ApperIcon name="Github" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {footerData.map((column) => (
            <FooterColumn
              key={column.Id}
              category={column.category}
              links={column.links}
              className="[&_h4]:text-white [&_a]:text-gray-400 [&_a:hover]:text-white"
            />
          ))}
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BillFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#cookies"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
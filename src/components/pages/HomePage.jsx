import Header from "@/components/organisms/Header";
import Hero from "@/components/organisms/Hero";
import Features from "@/components/organisms/Features";
import CTA from "@/components/organisms/CTA";
import Footer from "@/components/organisms/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
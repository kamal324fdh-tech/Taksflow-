import Hero from "../components/landing/Hero";
import ProductPreview from "../components/landing/ProductPreview";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductPreview />
      <Features />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </>
  );
}
import React from "react";
import DealsSection from "../../components/UI/dealsSection";
import { CarouselWithCaptionsExample } from "../../components/UI/Carousel";
import TopCategories from "../../components/UI/TopCategories"; // Asegurar que este componente esté importado correctamente

const HomePage = () => {
  return (
    <div className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-gray-900 text-gray-900">
      {/* Carousel Section */}
      <section className="relative">
        <CarouselWithCaptionsExample />
      </section>

      {/* Categorías Destacadas */}
      <section className="container mx-auto px-4 py-2">
        <TopCategories />
      </section>

      {/* Categorías Populares */}
      <section className="container mx-auto py-2">
        <DealsSection />
      </section>
    </div>
  );
};

export default HomePage;

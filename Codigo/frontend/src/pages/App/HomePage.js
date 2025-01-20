import React from "react";
import DealsSection from "../../components/UI/dealsSection";
import { CarouselWithCaptionsExample } from "../../components/UI/Carousel";
import { CardGrid3Example } from "../../components/UI/CardGrid";

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-gray-100">
      {/* Carousel Section */}
      <section className="relative">
        <CarouselWithCaptionsExample />
      </section>

      {/* Deals Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Categorías Populares</h2>
        <DealsSection />
      </section>

      {/* Category Cards */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Descripción de Categorías</h2>
        <CardGrid3Example />
      </section>
    </div>
  );
};

export default HomePage;

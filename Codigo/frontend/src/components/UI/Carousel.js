import React from "react";
import {
  CCarousel,
  CCarouselCaption,
  CCarouselItem,
  CImage,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

// Importa las imágenes
import GraphicCard from "../../assets/HomePage/GraphicCard.jpg";
import ComponentsPc from "../../assets/HomePage/ComponentsPc.jpg";
import MotherBoard from "../../assets/HomePage/MotherBoard.jpg";

export const CarouselWithCaptionsExample = () => {
  return (
    <div className="relative w-full bg-gray-900">
      <CCarousel controls indicators transition="crossfade" className="h-[500px]">
        <CCarouselItem className="h-full">
          <CImage
            className="d-block w-full h-full object-cover"
            src={GraphicCard}
            alt="slide 1"
            style={{ height: "500px", objectFit: "cover" }}
          />
          <CCarouselCaption className="d-none d-md-block">
            <h5 className="text-white text-3xl font-bold">Tarjetas Gráficas</h5>
            <p>Descubre las tarjetas gráficas más populares.</p>
          </CCarouselCaption>
        </CCarouselItem>
        <CCarouselItem className="h-full">
          <CImage
            className="d-block w-full h-full object-cover"
            src={ComponentsPc}
            alt="slide 2"
            style={{ height: "500px", objectFit: "cover" }}
          />
          <CCarouselCaption className="d-none d-md-block">
            <h5 className="text-white text-3xl font-bold">Componentes PC</h5>
            <p>Personaliza la PC de tus sueños con los componentes que necesitas.</p>
          </CCarouselCaption>
        </CCarouselItem>
        <CCarouselItem className="h-full">
          <CImage
            className="d-block w-full h-full object-cover"
            src={MotherBoard}
            alt="slide 3"
            style={{ height: "500px", objectFit: "cover" }}
          />
          <CCarouselCaption className="d-none d-md-block">
            <h5 className="text-white text-3xl font-bold">Placas Pc</h5>
            <p>Explora las ultimas placas de PC y descubre las mejores opciones.</p>
          </CCarouselCaption>
        </CCarouselItem>
      </CCarousel>
    </div>
  );
};

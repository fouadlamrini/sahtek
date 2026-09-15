import { useEffect, useRef, useState } from "react";
import slide from "../data/silde";

function Slide() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);

  // المسافة بين الصور
  const GAP = 16;

  // سرعة الحركة
  const SPEED = 0.7;

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const moveSlider = () => {
      if (!isPaused) {
        slider.scrollLeft += SPEED;

        /*
          عدد الصور = 36

          كل image عندها:
          width = 220px
          gap = 16px

          إذن المجموعة كاملة:
          36 × (220 + 16)
        */

        const oneSetWidth =
          slide.length * (220 + GAP);

        /*
          ملي ندوزو المجموعة الأولى كاملة،
          نرجعو نفس المسافة للبداية.

          المستخدم ما غاديش يحس بالـ jump
          حيث المجموعة الثانية مطابقة للأولى.
        */
        if (slider.scrollLeft >= oneSetWidth) {
          slider.scrollLeft -= oneSetWidth;
        }
      }

      animationRef.current =
        requestAnimationFrame(moveSlider);
    };

    animationRef.current =
      requestAnimationFrame(moveSlider);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  return (
    <section className="w-full py-12">

      {/* Title */}
      <h2
        className="
          mb-8
          text-center
          text-2xl
          font-bold
          text-[#204115]
          sm:text-3xl
        "
      >
        Les commandes de nos clients
      </h2>

      {/* Film strip container */}
      <div className="relative w-full">

        {/* Top film holes */}
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-2
            z-10
            flex
            w-full
            justify-around
            overflow-hidden
            px-2
          "
        >
          {[...Array(20)].map((_, index) => (
            <span
              key={index}
              className="
                h-3
                w-6
                shrink-0
                rounded-sm
                bg-white
              "
            />
          ))}
        </div>

        {/* Bottom film holes */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-2
            left-0
            z-10
            flex
            w-full
            justify-around
            overflow-hidden
            px-2
          "
        >
          {[...Array(20)].map((_, index) => (
            <span
              key={index}
              className="
                h-3
                w-6
                shrink-0
                rounded-sm
                bg-white
              "
            />
          ))}
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="
            flex
            w-full
            gap-4
            overflow-hidden
            bg-[#204115]
            px-4
            py-8
            select-none
          "
        >

          {/* First set + duplicated set */}
          {[...slide, ...slide].map((image, index) => (
            <div
              key={index}
              className="
                w-[220px]
                min-w-[220px]
                shrink-0
                overflow-hidden
                rounded-xl
                border-4
                border-[#649714]
                bg-white
                shadow-lg
                transition
                duration-300
                hover:border-[#E58730]
              "
            >
              <img
                src={image}
                alt={`Commande client ${
                  (index % slide.length) + 1
                }`}
                draggable="false"
                className="
                  h-[280px]
                  w-full
                  object-cover
                "
              />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Slide;
"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate    = useTransform(scrollYProgress, [0, 0.7], [20, 0]);
    const scale     = useTransform(scrollYProgress, [0, 0.7], scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 0.7], [0, -100]);

  return (
    <div className="h-240 md:h-300 flex items-center justify-center relative px-4 md:px-8" ref={containerRef}>
      <div className="py-8 md:py-24 w-full relative" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => (
  <motion.div style={{ translateY: translate }} className="w-[90%] mx-auto text-center mb-8">
    {titleComponent}
  </motion.div>
);

export const Card = ({ rotate, scale, children }) => (
  <motion.div
    style={{
      rotateX: rotate, scale,
      boxShadow: "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026",
    }}
    className=" -mt-8 mx-auto h-120 md:h-152 w-full border border-[rgba(170,187,197,0.12)] p-2 md:p-4 bg-[#1a1a1c] rounded-3xl">
    <div className="h-full w-full overflow-hidden rounded-xl">
      {children}
    </div>
  </motion.div>
);
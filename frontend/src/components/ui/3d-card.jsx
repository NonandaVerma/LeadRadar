"use client";
import React, { createContext, useState, useContext, useRef } from "react";

const MouseEnterContext = createContext([false, () => {}]);

export const CardContainer = ({ children, className = "", containerClassName = "" }) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width  / 2) / 12;
    const y = (e.clientY - top  - height / 2) / 12;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (!containerRef.current) return;
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        style={{ perspective: "1000px" }}
        className={containerClassName}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={containerRef}
          className={className}
          style={{ transformStyle: "preserve-3d", transition: "transform 0.18s ease-out" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className = "" }) => (
  <div
    className={className}
    style={{ transformStyle: "preserve-3d" }}
  >
    {children}
  </div>
);

export const CardItem = ({
  as: Tag = "div",
  children,
  className = "",
  translateZ = 0,
  ...rest
}) => {
  const [isMouseEntered] = useContext(MouseEnterContext);
  return (
    <Tag
      className={className}
      style={{
        transform: isMouseEntered ? `translateZ(${translateZ}px)` : "translateZ(0px)",
        transition: "transform 0.18s ease-out",
        transformStyle: "preserve-3d",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
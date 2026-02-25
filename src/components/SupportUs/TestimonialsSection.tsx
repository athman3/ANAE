"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { communityTestimonials, type Testimonial } from "@/data/testimonials";

export default function TestimonialsSection() {
  const t = useTranslations("supportUs.testimonials");
  const baseItems = communityTestimonials;
  // Create enough duplicates for smooth scrolling on wide screens
  // 4 sets ensures we always have enough content to scroll and wrap seamlessly
  const items = [...baseItems, ...baseItems, ...baseItems, ...baseItems];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [itemWidth, setItemWidth] = useState(350);

  useEffect(() => {
    // Update width based on screen size
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemWidth(280);
      } else if (window.innerWidth < 1024) {
        setItemWidth(320); // Intermediate size for tablets/small laptops
      } else {
        setItemWidth(350);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let animationFrameId: number;
    let scrollPos = 0;
    const speed = 0.3; // Slowed down from 0.8
    
    const gap = 16; // gap-4 is 16px
    const singleItemTotalWidth = itemWidth + gap;
    const singleSetWidth = baseItems.length * singleItemTotalWidth;

    const animate = () => {
      scrollPos -= speed;
      
      // Reset position for infinite loop when we've scrolled past one full set
      if (Math.abs(scrollPos) >= singleSetWidth) {
        scrollPos += singleSetWidth;
      }

      // Apply translation to the track
      track.style.transform = `translate3d(${scrollPos}px, 0, 0)`;

      // Calculate center of the visible container
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.width / 2;

      // Update scale for each card
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Calculate card's horizontal center position relative to the container's left edge.
        // The card's natural position is index * width.
        // The track is shifted by scrollPos (which is negative).
        const cardNaturalX = index * singleItemTotalWidth;
        const cardCurrentLeft = cardNaturalX + scrollPos; 
        const cardCenter = cardCurrentLeft + itemWidth / 2;
        
        // Distance from the center of the container
        const dist = Math.abs(containerCenter - cardCenter);
        
        // Scaling logic
        // Max scale at center (0 distance), Min scale at edges
        const maxDist = containerRect.width / 1.5; // Range of effect
        const maxScale = 1.05; // Center scale
        const minScale = 1.0; // Edge scale - keep natural size

        let scale = minScale;
        let opacity = 0.8;

        if (dist < maxDist) {
            // Calculate a ratio (0 at maxDist, 1 at center)
            const ratio = Math.max(0, 1 - (dist / maxDist));
            
            // Apply easing (quadratic) for smoother curve
            const easedRatio = ratio * ratio; 
            
            scale = minScale + (maxScale - minScale) * easedRatio;
            opacity = 0.8 + (1 - 0.8) * easedRatio;
        }

        // Apply scale
        card.style.transform = `scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.zIndex = `${Math.round(scale * 100)}`; // Ensure center item is on top
        
        // Apply margins to compensate for scale and keep constant visual gap
        // Expansion is the total extra width added by scaling
        const expansion = itemWidth * (scale - 1);
        const margin = expansion / 2;
        card.style.marginLeft = `${margin}px`;
        card.style.marginRight = `${margin}px`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [baseItems.length, itemWidth]);

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h2>
      </div>

      <div 
        ref={containerRef} 
        className="relative w-full group flex items-center overflow-hidden h-[400px] sm:h-[450px] md:h-[500px]"
      >
        {/* Gradients for fade effect on edges */}
        <div className="absolute left-0 top-0 bottom-0 z-20 w-16 md:w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 z-20 w-16 md:w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        {/* Track */}
        <div 
          ref={trackRef} 
          className="flex gap-4 absolute left-0"
          style={{ willChange: 'transform' }}
        > 
           {items.map((item, i) => (
            <div
                key={`item-${i}`}
                ref={(el) => { cardsRef.current[i] = el }}
                className="flex-shrink-0"
                style={{ width: `${itemWidth}px`, height: `${itemWidth}px`, willChange: 'transform, opacity' }} // Explicit dynamic width/height to make it square
            >
                <TestimonialCard testimonial={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const isRtl = testimonial.dir === 'rtl';
  
  return (
    <div 
      className={`flex h-full w-full flex-col rounded-xl border border-border bg-card p-5 sm:p-8 ${isRtl ? 'text-right' : 'text-left'}`}
      dir={testimonial.dir}
      lang={testimonial.lang}
    >
      <div>
        <Quote className={`mb-3 sm:mb-6 h-6 w-6 sm:h-8 sm:w-8 text-primary/20 shrink-0 ${isRtl ? 'ml-auto transform -scale-x-100' : ''}`} />
        <blockquote className="text-[13px] sm:text-base italic leading-relaxed text-muted-foreground line-clamp-6 sm:line-clamp-none">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>
      <div className="border-t border-border pt-4 mt-auto">
        <p className="font-semibold text-foreground truncate">
          {testimonial.name}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground truncate">
          {testimonial.role}
        </p>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';

export const useScrollAnimations = () => {
  const revealObserverRef = useRef<IntersectionObserver | null>(null);
  const cardObserverRef = useRef<IntersectionObserver | null>(null);
  const imageObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 1. Reveal animations (one-way: appear once)
    revealObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px 0px' }
    );

    // 2. Card zoom (two-way: appear/disappear)
    cardObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            entry.target.classList.remove('out-view');
          } else {
            entry.target.classList.add('out-view');
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    // 3. Image zoom (threshold-based)
    imageObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          if (ratio > 0.3 && ratio < 0.9) {
            entry.target.classList.add('zoom');
          } else {
            entry.target.classList.remove('zoom');
          }
        });
      },
      { threshold: [0, 0.3, 0.6, 0.9] }
    );

    // Observe elements
    document.querySelectorAll('.animate-reveal').forEach((el) => {
      revealObserverRef.current?.observe(el);
    });

    document.querySelectorAll('.card-zoom-scroll, .zoom-on-scroll').forEach((el) => {
      cardObserverRef.current?.observe(el);
    });

    document.querySelectorAll('.image-zoom-scroll').forEach((el) => {
      imageObserverRef.current?.observe(el);
    });

    // Scroll handler for continuous position-dependent effects:
    // hero-zoom, parallax-zoom, section-scale, text-zoom-scroll
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;

          // Hero background zoom
          document.querySelectorAll<HTMLElement>('.hero-zoom').forEach((el) => {
            const scrollPercent = Math.min(scrollY / windowHeight, 1);
            el.style.transform = `scale(${1 + scrollPercent * 0.1})`;
          });

          // Parallax zoom for content blocks
          document.querySelectorAll<HTMLElement>('.parallax-zoom').forEach((el) => {
            const rect = el.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distance = Math.abs(elementCenter - windowHeight / 2);
            const factor = Math.max(0, 1 - distance / (windowHeight / 2));
            el.style.transform = `scale(${1 + factor * 0.05})`;
          });

          // Section scale up/down
          document.querySelectorAll<HTMLElement>('.section-scale').forEach((el) => {
            const rect = el.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const windowCenter = windowHeight / 2;

            if (elementCenter < windowCenter && rect.bottom > 0) {
              el.classList.add('scale-up');
              el.classList.remove('scale-down');
            } else if (elementCenter > windowCenter && rect.top < windowHeight) {
              el.classList.add('scale-down');
              el.classList.remove('scale-up');
            } else {
              el.classList.remove('scale-up', 'scale-down');
            }
          });

          // Text zoom based on distance to center
          document.querySelectorAll<HTMLElement>('.text-zoom-scroll').forEach((el) => {
            const rect = el.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const distance = Math.abs(elementCenter - windowHeight / 2);

            if (distance < windowHeight / 3) {
              el.classList.add('zoom-text');
              el.classList.remove('fade-text');
            } else {
              el.classList.add('fade-text');
              el.classList.remove('zoom-text');
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial run + listener
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      revealObserverRef.current?.disconnect();
      cardObserverRef.current?.disconnect();
      imageObserverRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useInView } from 'framer-motion';

const SequenceContext = createContext(null);
const useSequence = () => useContext(SequenceContext);

const ItemIndexContext = createContext(null);
const useItemIndex = () => useContext(ItemIndexContext);

export function AnimatedSpan({
  children,
  delay = 0,
  className = '',
  startOnView = false,
  ...props
}) {
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, {
    amount: 0.3,
    once: true,
  });

  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!sequence || itemIndex === null) return;
    if (!sequence.sequenceStarted) return;
    if (hasStarted) return;
    if (sequence.activeIndex === itemIndex) {
      setHasStarted(true);
    }
  }, [sequence, hasStarted, itemIndex]);

  const shouldAnimate = sequence ? hasStarted : startOnView ? isInView : true;

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: sequence ? 0 : delay / 1000 }}
      className={`grid text-xs sm:text-sm font-mono tracking-tight ${className}`}
      onAnimationComplete={() => {
        if (!sequence) return;
        if (itemIndex === null) return;
        sequence.completeItem(itemIndex);
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function TypingAnimation({
  children,
  className = '',
  duration = 40,
  delay = 0,
  as: Component = 'span',
  startOnView = true,
  ...props
}) {
  if (typeof children !== 'string') {
    throw new Error('TypingAnimation: children must be a string.');
  }

  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, {
    amount: 0.3,
    once: true,
  });

  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const hasSequence = sequence !== null;
  const sequenceStarted = sequence?.sequenceStarted ?? false;
  const sequenceActiveIndex = sequence?.activeIndex ?? null;
  const sequenceCompleteItemRef = useRef(null);
  const sequenceItemIndexRef = useRef(null);

  useEffect(() => {
    sequenceCompleteItemRef.current = sequence?.completeItem ?? null;
    sequenceItemIndexRef.current = itemIndex;
  }, [sequence?.completeItem, itemIndex]);

  useEffect(() => {
    let startTimeout = null;

    if (hasSequence && itemIndex !== null) {
      if (sequenceStarted && !started && sequenceActiveIndex === itemIndex) {
        setStarted(true);
      }
    } else if (!startOnView || isInView) {
      startTimeout = setTimeout(() => setStarted(true), delay);
    }

    return () => {
      if (startTimeout !== null) {
        clearTimeout(startTimeout);
      }
    };
  }, [
    delay,
    startOnView,
    isInView,
    started,
    hasSequence,
    sequenceActiveIndex,
    sequenceStarted,
    itemIndex,
  ]);

  useEffect(() => {
    let typingEffect = null;

    if (started) {
      let i = 0;
      typingEffect = setInterval(() => {
        if (i < children.length) {
          setDisplayedText(children.substring(0, i + 1));
          i++;
        } else {
          if (typingEffect !== null) {
            clearInterval(typingEffect);
          }
          const completeItem = sequenceCompleteItemRef.current;
          const currentItemIndex = sequenceItemIndexRef.current;
          if (completeItem && currentItemIndex !== null) {
            completeItem(currentItemIndex);
          }
        }
      }, duration);
    }

    return () => {
      if (typingEffect !== null) {
        clearInterval(typingEffect);
      }
    };
  }, [children, duration, started]);

  return (
    <Component
      ref={elementRef}
      className={`text-xs sm:text-sm font-mono tracking-tight ${className}`}
      {...props}
    >
      {displayedText}
    </Component>
  );
}

export function Terminal({
  children,
  className = '',
  sequence = true,
  startOnView = true,
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, {
    amount: 0.3,
    once: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const sequenceHasStarted = sequence ? !startOnView || isInView : false;

  const contextValue = useMemo(() => {
    if (!sequence) return null;
    return {
      completeItem: (index) => {
        setActiveIndex((current) => (index === current ? current + 1 : current));
      },
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    };
  }, [sequence, activeIndex, sequenceHasStarted]);

  const wrappedChildren = useMemo(() => {
    if (!sequence) return children;
    const array = Children.toArray(children);
    return array.map((child, index) => (
      <ItemIndexContext.Provider key={index} value={index}>
        {child}
      </ItemIndexContext.Provider>
    ));
  }, [children, sequence]);

  const content = (
    <div
      ref={containerRef}
      className={`z-0 w-full max-w-4xl mx-auto rounded-2xl border border-white/[0.12] bg-[#070B12]/95 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden ${className}`}
    >
      {/* macOS Terminal Window Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#E61E38]/80 border border-[#E61E38]" />
          <div className="h-3 w-3 rounded-full bg-[#FFB800]/80 border border-[#FFB800]" />
          <div className="h-3 w-3 rounded-full bg-[#00D672]/80 border border-[#00D672]" />
        </div>
        <div className="text-[11px] font-mono text-white/50 tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E32] animate-pulse" />
          eleven@intelligence-core: ~/pipeline
        </div>
        <div className="text-[10px] font-mono text-white/30 hidden sm:block">
          zsh — Python 3.13
        </div>
      </div>

      {/* Terminal Output Code Area */}
      <pre className="p-6 sm:p-8 overflow-x-auto text-left leading-relaxed">
        <code className="grid gap-y-2.5 overflow-auto font-mono text-xs sm:text-sm">
          {wrappedChildren}
        </code>
      </pre>
    </div>
  );

  if (!sequence) return content;

  return (
    <SequenceContext.Provider value={contextValue}>
      {content}
    </SequenceContext.Provider>
  );
}

export default Terminal;

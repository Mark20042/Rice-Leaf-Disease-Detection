import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

const SPOTLIGHT_PADDING = 10;
const TOOLTIP_GAP = 18;
const VIEWPORT_MARGIN = 12;

const steps = [
  {
    target: '.uploader-container',
    title: 'Upload Here',
    description:
      'Select a clear leaf image to analyze. Click this box or drag-and-drop your photo into it to start.',
    preferred: ['right', 'bottom', 'top', 'left'],
  },
  {
    target: '.results-container',
    title: 'AI Analysis',
    description:
      'Your diagnosis appears in this panel: the detected disease, the confidence score, plus prevention and treatment advice for your crops.',
    preferred: ['left', 'bottom', 'top', 'right'],
  },
  {
    target: '.probabilities-panel',
    title: 'Prediction Probabilities',
    description:
      "These bars show how confident the model is for each disease class. The highest bar is the final diagnosis.",
    preferred: ['left', 'bottom', 'top', 'right'],
  },
];

const arrowSideFor = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const computePlacement = (rect, tooltip, preferred) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { width: tw, height: th } = tooltip;

  const spaces = {
    top: rect.top,
    bottom: vh - rect.bottom,
    left: rect.left,
    right: vw - rect.right,
  };

  const fits = {
    top: spaces.top >= th + TOOLTIP_GAP + VIEWPORT_MARGIN,
    bottom: spaces.bottom >= th + TOOLTIP_GAP + VIEWPORT_MARGIN,
    left: spaces.left >= tw + TOOLTIP_GAP + VIEWPORT_MARGIN,
    right: spaces.right >= tw + TOOLTIP_GAP + VIEWPORT_MARGIN,
  };

  let placement = preferred.find((side) => fits[side]);
  if (!placement) {
    placement = ['bottom', 'top', 'right', 'left'].sort((a, b) => spaces[b] - spaces[a])[0];
  }

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let top;
  let left;
  if (placement === 'top') {
    top = rect.top - th - TOOLTIP_GAP;
    left = centerX - tw / 2;
  } else if (placement === 'bottom') {
    top = rect.bottom + TOOLTIP_GAP;
    left = centerX - tw / 2;
  } else if (placement === 'left') {
    left = rect.left - tw - TOOLTIP_GAP;
    top = centerY - th / 2;
  } else {
    left = rect.right + TOOLTIP_GAP;
    top = centerY - th / 2;
  }

  left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - tw - VIEWPORT_MARGIN));
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - th - VIEWPORT_MARGIN));

  const isVertical = placement === 'top' || placement === 'bottom';
  const rawOffset = isVertical ? centerX - left : centerY - top;
  const maxOffset = (isVertical ? tw : th) - 28;
  const arrowOffset = Math.max(28, Math.min(rawOffset, maxOffset));

  return { top, left, placement, arrowOffset };
};

const TutorialModal = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [geometry, setGeometry] = useState(null);
  const tooltipRef = useRef(null);

  const step = steps[currentStep];

  const updateGeometry = useCallback(() => {
    const target = document.querySelector(step.target);
    const tooltipEl = tooltipRef.current;
    if (!target || !tooltipEl) {
      setGeometry(null);
      return;
    }
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    setGeometry({
      rect,
      ...computePlacement(
        rect,
        { width: tooltipRect.width, height: tooltipRect.height },
        step.preferred
      ),
    });
  }, [step]);

  // Measure before paint so the tooltip never flashes in the wrong place
  useLayoutEffect(() => {
    updateGeometry();
  }, [updateGeometry]);

  useEffect(() => {
    const target = document.querySelector(step.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }

    const settleTimers = [setTimeout(updateGeometry, 350), setTimeout(updateGeometry, 700)];
    window.addEventListener('resize', updateGeometry);
    window.addEventListener('scroll', updateGeometry, true);
    return () => {
      settleTimers.forEach(clearTimeout);
      window.removeEventListener('resize', updateGeometry);
      window.removeEventListener('scroll', updateGeometry, true);
    };
  }, [step, updateGeometry]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const tooltipStyle = geometry
    ? { top: geometry.top, left: geometry.left }
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  const arrowSide = geometry ? arrowSideFor[geometry.placement] : null;
  const arrowStyle = geometry
    ? (geometry.placement === 'top' || geometry.placement === 'bottom')
      ? { left: geometry.arrowOffset }
      : { top: geometry.arrowOffset }
    : {};

  return (
    <div className="tutorial-tour-overlay">
      {geometry && (
        <div
          className="tutorial-spotlight"
          style={{
            top: geometry.rect.top - SPOTLIGHT_PADDING,
            left: geometry.rect.left - SPOTLIGHT_PADDING,
            width: geometry.rect.width + SPOTLIGHT_PADDING * 2,
            height: geometry.rect.height + SPOTLIGHT_PADDING * 2,
          }}
        />
      )}

      <div
        ref={tooltipRef}
        className={`tutorial-tooltip${geometry ? '' : ' tutorial-tooltip-centered'}`}
        style={tooltipStyle}
      >
        {arrowSide && <span className={`tutorial-arrow arrow-${arrowSide}`} style={arrowStyle} />}


        <h3>{step.title}</h3>
        <p>{step.description}</p>

        <div className="tutorial-progress tutorial-progress-centered">
          {steps.map((s, index) => (
            <span
              key={s.target}
              className={`progress-dot${index === currentStep ? ' active' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>

        <div className="tutorial-tooltip-actions">
          <button
            type="button"
            className="tutorial-btn secondary small"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button type="button" className="tutorial-btn primary small" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Got it' : 'Next'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;

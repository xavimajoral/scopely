import { useEffect, useRef, useState } from 'react';

interface UseResizableSidebarOptions {
  localStorageKey?: string;
  defaultWidth?: number;
  minWidth?: number;
  maxWidthPercent?: number;
}

interface UseResizableSidebarReturn {
  sidebarWidth: number;
  isResizing: boolean;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: (e: React.MouseEvent) => void;
}

const DEFAULT_WIDTH = 400;
const MIN_WIDTH = 300;
const MAX_WIDTH_PERCENT = 0.6;

/**
 * Custom hook for managing a resizable sidebar with localStorage persistence
 */
export function useResizableSidebar(
  options: UseResizableSidebarOptions = {}
): UseResizableSidebarReturn {
  const {
    localStorageKey = 'ticketListWidth',
    defaultWidth = DEFAULT_WIDTH,
    minWidth = MIN_WIDTH,
    maxWidthPercent = MAX_WIDTH_PERCENT,
  } = options;

  const getInitialWidth = () => {
    const saved = localStorage.getItem(localStorageKey);
    return saved ? parseInt(saved, 10) : defaultWidth;
  };

  const [sidebarWidth, setSidebarWidth] = useState(getInitialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Effect to handle the resizing of the sidebar
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX;
      const maxWidth = window.innerWidth * maxWidthPercent;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        localStorage.setItem(localStorageKey, newWidth.toString());
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.classList.add('resizingSidebar');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizingSidebar');
    };
  }, [isResizing, minWidth, maxWidthPercent, localStorageKey]);

  return {
    sidebarWidth,
    isResizing,
    sidebarRef,
    handleMouseDown,
  };
}


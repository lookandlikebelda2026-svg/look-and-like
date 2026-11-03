import React from 'react';

/**
 * Mainbody / MainContent Component
 * Uses the full screen area edge-to-edge without artificial width cages or containers.
 * Responsive padding (p-4 sm:p-6 lg:p-8) and mobile bottom clearance (pb-28).
 */
export function Mainbody({ children, className = '' }) {
  return (
    <div className={`w-full p-4 sm:p-6 lg:p-8 pb-28 lg:pb-10 ${className}`}>
      {children}
    </div>
  );
}

export default Mainbody;

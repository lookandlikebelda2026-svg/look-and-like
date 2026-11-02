import React from 'react';

/**
 * Mainbody container for the Management Layout
 * Renders the active management tab section (Lookbook or Partners) with luxury styling and scrolling
 */
export function Mainbody({ children, className = '' }) {
  return (
    <div className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF8F5]/40 space-y-6 ${className}`}>
      {children}
    </div>
  );
}

export default Mainbody;

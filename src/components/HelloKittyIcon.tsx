const HelloKittyIcon = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Face */}
      <ellipse cx="50" cy="55" rx="35" ry="30" fill="white" stroke="hsl(330, 100%, 71%)" strokeWidth="2"/>
      
      {/* Left ear */}
      <ellipse cx="25" cy="30" rx="12" ry="15" fill="white" stroke="hsl(330, 100%, 71%)" strokeWidth="2"/>
      
      {/* Right ear */}
      <ellipse cx="75" cy="30" rx="12" ry="15" fill="white" stroke="hsl(330, 100%, 71%)" strokeWidth="2"/>
      
      {/* Bow */}
      <ellipse cx="82" cy="25" rx="8" ry="6" fill="hsl(0, 80%, 65%)" />
      <ellipse cx="92" cy="32" rx="8" ry="6" fill="hsl(0, 80%, 65%)" />
      <circle cx="87" cy="28" r="4" fill="hsl(45, 100%, 70%)" />
      
      {/* Left eye */}
      <ellipse cx="38" cy="52" rx="4" ry="5" fill="hsl(340, 30%, 25%)"/>
      
      {/* Right eye */}
      <ellipse cx="62" cy="52" rx="4" ry="5" fill="hsl(340, 30%, 25%)"/>
      
      {/* Nose */}
      <ellipse cx="50" cy="60" rx="3" ry="2.5" fill="hsl(45, 100%, 70%)"/>
      
      {/* Whiskers left */}
      <line x1="20" y1="55" x2="32" y2="58" stroke="hsl(340, 30%, 25%)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="62" x2="32" y2="62" stroke="hsl(340, 30%, 25%)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="69" x2="32" y2="66" stroke="hsl(340, 30%, 25%)" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Whiskers right */}
      <line x1="80" y1="55" x2="68" y2="58" stroke="hsl(340, 30%, 25%)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="82" y1="62" x2="68" y2="62" stroke="hsl(340, 30%, 25%)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="80" y1="69" x2="68" y2="66" stroke="hsl(340, 30%, 25%)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
};

export default HelloKittyIcon;

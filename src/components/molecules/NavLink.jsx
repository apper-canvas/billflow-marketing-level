import React from "react";
import { cn } from "@/utils/cn";

const NavLink = React.forwardRef(({ className, href, children, ...props }, ref) => {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      className={cn(
        "text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300 hover:after:w-full",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
});

NavLink.displayName = "NavLink";

export default NavLink;
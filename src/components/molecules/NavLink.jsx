import { Link } from "react-router-dom";
import React from "react";
import { cn } from "@/utils/cn";

export default function NavLink({ to, children, className }) {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium text-gray-700 hover:text-primary transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}

NavLink.displayName = "NavLink";
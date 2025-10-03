import React from "react";
import { cn } from "@/utils/cn";

const FooterColumn = React.forwardRef(
  ({ className, category, links, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <h4 className="text-gray-900 font-semibold text-lg">{category}</h4>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.Id}>
              <a
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

FooterColumn.displayName = "FooterColumn";

export default FooterColumn;
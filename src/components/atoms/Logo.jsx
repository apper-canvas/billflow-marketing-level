import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Logo = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
        <ApperIcon name="Zap" className="w-6 h-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-gray-900">BillFlow</span>
    </div>
  );
});

Logo.displayName = "Logo";

export default Logo;
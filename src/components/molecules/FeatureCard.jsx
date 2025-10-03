import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const FeatureCard = React.forwardRef(
  ({ className, icon, title, description, index = 0, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={cn(
          "bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100",
          className
        )}
        {...props}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <ApperIcon name={icon} className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

export default function FeatureDetailSection({ feature, index, reverse = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
        reverse && "lg:grid-flow-dense"
      )}
    >
      {/* Feature Content */}
      <div className={cn("space-y-6", reverse && "lg:col-start-2")}>
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-primary rounded-full">
          <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
          <span className="text-white font-semibold">{feature.title}</span>
        </div>

        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
          {feature.detailedDescription || feature.description}
        </h3>

        {feature.benefits && feature.benefits.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">Key Benefits:</h4>
            <ul className="space-y-3">
              {feature.benefits.map((benefit, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mt-0.5">
                    <ApperIcon name="Check" className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Feature Mockup/Screenshot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={cn(
          "relative",
          reverse && "lg:col-start-1 lg:row-start-1"
        )}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
          {/* Mockup Browser Chrome */}
          <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-4 bg-white rounded px-3 py-1 text-xs text-gray-500">
              billflow.app/{feature.mockupImage?.replace('.png', '')}
            </div>
          </div>

          {/* Mockup Content Area with Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto shadow-xl">
                <ApperIcon name={feature.icon} className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">{feature.title}</p>
                <p className="text-gray-600 max-w-md mx-auto">
                  {feature.description}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <ApperIcon name="Image" className="w-4 h-4" />
                <span>Feature screenshot placeholder</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-gradient-secondary rounded-full opacity-10 blur-3xl" />
        <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-gradient-primary rounded-full opacity-10 blur-3xl" />
      </motion.div>
    </motion.div>
  );
}
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import planComparisonService from "@/services/api/planComparisonService";
import { cn } from "@/utils/cn";

export default function ComparisonTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const comparisonData = await planComparisonService.getAll();
      setData(comparisonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <Error message={`Failed to load comparison data: ${error}`} />;
  }

  if (!data) {
    return null;
  }

  const renderFeatureValue = (value) => {
    if (typeof value === "boolean") {
      return value ? (
        <ApperIcon name="Check" className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <ApperIcon name="X" className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-gray-700">{value}</span>;
  };

  return (
    <div className="space-y-12">
      {/* Plans Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.plans.map((plan, index) => (
          <motion.div
            key={plan.Id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-2xl",
              plan.popular ? "border-primary scale-105 lg:scale-110" : "border-gray-200"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <div className="space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.billingPeriod}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <Button
                size="lg"
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
              >
                Start Free Trial
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Feature Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                  Feature
                </th>
                {data.plans.map((plan) => (
                  <th
                    key={plan.Id}
                    className={cn(
                      "py-4 px-6 text-center text-sm font-semibold",
                      plan.popular ? "text-primary" : "text-gray-900"
                    )}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.featureCategories.map((category, catIndex) => (
                <>
                  <tr key={`category-${catIndex}`} className="bg-gray-50">
                    <td
                      colSpan={data.plans.length + 1}
                      className="py-3 px-6 text-sm font-semibold text-gray-900"
                    >
                      {category.name}
                    </td>
                  </tr>
                  {category.features.map((feature, featIndex) => (
                    <tr
                      key={`feature-${catIndex}-${featIndex}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {feature.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        {renderFeatureValue(feature.starter)}
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        {renderFeatureValue(feature.professional)}
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        {renderFeatureValue(feature.business)}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <p className="text-gray-600">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
            <span>Upgrade or downgrade easily</span>
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Check" className="w-4 h-4 text-green-600" />
            <span>Annual billing available (save 20%)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
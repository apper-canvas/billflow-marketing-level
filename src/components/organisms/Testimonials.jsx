import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import testimonialsService from "@/services/api/testimonialsService";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testimonialsService.getAll();
      setTestimonials(data);
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
    return <Error message={`Failed to load testimonials: ${error}`} />;
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <ApperIcon
            key={index}
            name="Star"
            className={`w-5 h-5 ${
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.Id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          {/* Rating */}
          <div className="mb-4">{renderStars(testimonial.rating)}</div>

          {/* Testimonial Content */}
          <blockquote className="text-gray-700 mb-6 leading-relaxed">
            "{testimonial.content}"
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-900">{testimonial.name}</div>
              <div className="text-sm text-gray-600">{testimonial.role}</div>
              <div className="text-sm text-gray-500">{testimonial.company}</div>
            </div>
          </div>

          {/* Featured Badge */}
          {testimonial.featured && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gradient-primary rounded-full">
              <ApperIcon name="Award" className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold text-white">Featured</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
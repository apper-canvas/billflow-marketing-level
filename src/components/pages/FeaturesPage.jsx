import { useState, useEffect } from "react";
import Container from "@/components/atoms/Container";
import FeatureDetailSection from "@/components/organisms/FeatureDetailSection";
import ComparisonTable from "@/components/organisms/ComparisonTable";
import Testimonials from "@/components/organisms/Testimonials";
import CTA from "@/components/organisms/CTA";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import featuresService from "@/services/api/featuresService";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await featuresService.getAll();
      setFeatures(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={`Failed to load features: ${error}`} />;
  }

  const coreFeatures = features.filter((f) => f.category === "Core Features");
  const automationFeatures = features.filter((f) => f.category === "Automation");
  const insightFeatures = features.filter((f) => f.category === "Insights");
  const otherFeatures = features.filter(
    (f) => !["Core Features", "Automation", "Insights"].includes(f.category)
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -90, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Powerful Features for Modern Billing
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
              Everything you need to automate your billing, get paid faster, and grow your business. 
              No complex setup, no hidden fees, just powerful tools that work.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Core Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Core <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The essential tools you need to manage your entire billing workflow
            </p>
          </motion.div>

          <div className="space-y-32">
            {coreFeatures.map((feature, index) => (
              <FeatureDetailSection
                key={feature.Id}
                feature={feature}
                index={index}
                reverse={index % 2 !== 0}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Automation Features Section */}
      {automationFeatures.length > 0 && (
        <section className="py-20 lg:py-32 bg-gray-50">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Automation <span className="text-gradient">That Works</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Set it and forget it - let BillFlow handle the repetitive tasks
              </p>
            </motion.div>

            <div className="space-y-32">
              {automationFeatures.map((feature, index) => (
                <FeatureDetailSection
                  key={feature.Id}
                  feature={feature}
                  index={index}
                  reverse={index % 2 === 0}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Insights & Analytics Section */}
      {insightFeatures.length > 0 && (
        <section className="py-20 lg:py-32 bg-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Insights & <span className="text-gradient">Analytics</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Make smarter decisions with real-time data and powerful reporting
              </p>
            </motion.div>

            <div className="space-y-32">
              {insightFeatures.map((feature, index) => (
                <FeatureDetailSection
                  key={feature.Id}
                  feature={feature}
                  index={index}
                  reverse={index % 2 !== 0}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Additional Features Grid */}
      {otherFeatures.length > 0 && (
        <section className="py-20 lg:py-32 bg-gray-50">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                And So Much <span className="text-gradient">More</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Additional powerful features to support your business growth
              </p>
            </motion.div>

            <div className="space-y-32">
              {otherFeatures.map((feature, index) => (
                <FeatureDetailSection
                  key={feature.Id}
                  feature={feature}
                  index={index}
                  reverse={index % 2 === 0}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Plan Comparison Section */}
      <section className="py-20 lg:py-32 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="text-gradient">Perfect Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All plans include our core features. Upgrade as you grow.
            </p>
          </motion.div>

          <ComparisonTable />
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about BillFlow
            </p>
          </motion.div>

          <Testimonials />
        </Container>
      </section>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
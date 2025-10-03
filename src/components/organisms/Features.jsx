import { useState, useEffect } from "react";
import Container from "@/components/atoms/Container";
import FeatureCard from "@/components/molecules/FeatureCard";
import featuresService from "@/services/api/featuresService";

export default function Features() {
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
    return (
      <section id="features" className="py-20 lg:py-32 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <div className="h-8 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section id="features" className="py-20 lg:py-32 bg-gray-50">
        <Container>
          <div className="text-center">
            <p className="text-red-600">Failed to load features: {error}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your billing process and
            help you get paid faster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.Id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
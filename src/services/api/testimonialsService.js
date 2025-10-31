import testimonialsData from "@/services/mockData/testimonials.json";

const testimonialsService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...testimonialsData];
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const testimonial = testimonialsData.find((t) => t.Id === parseInt(id));
    if (!testimonial) {
      throw new Error(`Testimonial with Id ${id} not found`);
    }
    return { ...testimonial };
  },

  getFeatured: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return testimonialsData.filter((t) => t.featured).map((t) => ({ ...t }));
  }
};

export default testimonialsService;
import planComparisonData from "@/services/mockData/planComparison.json";

const planComparisonService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(planComparisonData));
  },

  getPlans: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(planComparisonData.plans));
  },

  getFeatureCategories: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return JSON.parse(JSON.stringify(planComparisonData.featureCategories));
  },

  getPlanById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const plan = planComparisonData.plans.find((p) => p.Id === parseInt(id));
    if (!plan) {
      throw new Error(`Plan with Id ${id} not found`);
    }
    return JSON.parse(JSON.stringify(plan));
  }
};

export default planComparisonService;
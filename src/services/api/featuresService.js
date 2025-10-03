import featuresData from "@/services/mockData/features.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const featuresService = {
  getAll: async () => {
    await delay(300);
    return [...featuresData];
  },

  getById: async (id) => {
    await delay(200);
    const feature = featuresData.find((item) => item.Id === parseInt(id));
    if (!feature) {
      throw new Error("Feature not found");
    }
    return { ...feature };
  }
};

export default featuresService;
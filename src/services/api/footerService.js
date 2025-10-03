import footerData from "@/services/mockData/footerLinks.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const footerService = {
  getAll: async () => {
    await delay(100);
    return [...footerData];
  }
};

export default footerService;
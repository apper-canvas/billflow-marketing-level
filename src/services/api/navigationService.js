import navigationData from "@/services/mockData/navigationLinks.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const navigationService = {
  getAll: async () => {
    await delay(100);
    return [...navigationData];
  }
};

export default navigationService;
const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const contactService = {
  async submitContactForm(formData) {
    try {
      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_SEND_CONTACT_EMAIL,
        {
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!result.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_CONTACT_EMAIL}. The response body is: ${JSON.stringify(result)}.`);
      }

      return result;
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_CONTACT_EMAIL}. The error is: ${error.message}`);
      throw error;
    }
  }
};

export default contactService;
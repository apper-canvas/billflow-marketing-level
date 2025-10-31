const contactService = {
  async sendContactEmail(formData) {
    // Lazy initialize ApperClient when actually needed
    if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
      throw new Error('Apper SDK not loaded. Please refresh the page and try again.');
    }

    const { ApperClient } = window.ApperSDK;
    
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

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
        throw new Error(result.error || 'Failed to send contact email');
      }

      return result;
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_CONTACT_EMAIL}. The error is: ${error.message}`);
      throw error;
    }
  }
};

export default contactService;
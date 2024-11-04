const createFinchSandbox = async ({
    providerId,
    products = ["company", "directory", "individual", "employment"],
    employeeSize = 10
  }) => {
    try {
      const response = await fetch('https://sandbox.tryfinch.com/api/sandbox/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider_id: providerId,
          products: products,
          employee_size: employeeSize
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };
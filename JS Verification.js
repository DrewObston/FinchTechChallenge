<script>
        const fetchSandboxdata = async ( => {
            providerId,
            products = ["company", "directory", "individual", "employment"],
        }) => {
            try {
                if (configData != null){ console.log("Skipping fetch for new sandbox")
                }
                else{
                    console.log ("Requesting for new sandbox")
                    const requestConfig = {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                     };
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

        function validateProductData(data) {
            const errors = [];
            const warnings = [];
            
            // Check if endpoint exists and has the expected structure
            if (!data || !data.products) {
                errors.push("Invalid response format");
                return { errors, warnings };
            }

            // Check each endpoint has null values or missing endpoints
            const expectedProducts = ["company", "directory", "individual", "employment", "payment", "pay_statement"];
            
            expectedProducts.forEach(product => {
                if (data.products[product] === null) {
                    warnings.push(`${product}: No data available`);
                } else if (!data.products[product]) {
                    errors.push(`${product}: Error: missing endpoint`);
                }
            });

            return { errors, warnings };
        }

        function displayResults(resultsDiv, data, errors, warnings) {
            let html = '<h3>Sandbox Results</h3>';

            // Display errors if any
            if (errors.length > 0) {
                html += '<div class="error"><strong>Errors:</strong><ul>';
                errors.forEach(error => {
                    html += `<li>${error}</li>`;
                });
                html += '</ul></div>';
            }

            // Display warnings if any
            if (warnings.length > 0) {
                html += '<div class="warning"><strong>Warnings:</strong><ul>';
                warnings.forEach(warning => {
                    html += `<li>${warning}</li>`;
                });
                html += '</ul></div>';
            }

            // Display the full response data
            html += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            
            resultsDiv.innerHTML = html;
        }

        async function createSandbox() {
            const providerId = document.getElementById('providerId').value;
            const products = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = 'Retrieving Data...';

            try {
                const result = await fetchSandboxdata({
                    providerId,
                    products,
                    employeeSize
                });

                if (result.success) {
                    resultsDiv.innerHTML = `
                        <h3>Sandbox Created Successfully!</h3>
                        <pre>${JSON.stringify(result.data, null, 2)}</pre>
                    `;
                } else {
                    resultsDiv.innerHTML = `
                        <h3>Error Creating Sandbox</h3>
                        <pre>${result.error}</pre>
                    `;
                }
            } catch (error) {
                resultsDiv.innerHTML = `
                    <h3>Error</h3>
                    <pre>${error.message}</pre>
                `;
            }
        }
    </script>
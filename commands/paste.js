async function createPaste(title, body) {
  const url = 'https://paste.lcomrade.su/api/v1/new';
  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
  };

  // Prepare the body for the request
  const requestBody = new URLSearchParams({
      title: title,
      body: body,
      // Optional parameters can be added here if needed
      // lineEnd: 'LF',
      // syntax: 'plaintext',
      // oneUse: false,
      // expiration: 0,
      // author: 'Your Name',
      // authorEmail: 'your-email@example.com',
      // authorURL: 'https://your-url.com',
  });

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: requestBody,
          // Uncomment the line below if using Basic Authentication
          // credentials: 'include', 
      });

      // Check for HTTP errors
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse and return the JSON response
      const data = await response.json();
      return data;

  } catch (error) {
      console.error('Error creating paste:', error);
      throw error; // Re-throw the error for further handling if necessary
  }
}

export default {
    createPaste
}
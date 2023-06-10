# API Usage

The reduced.to URL Shortener API allows you to shorten long URLs into shorter, more manageable ones. This documentation provides details on how to use the API effectively.

## API Base URL

The base URL for the API is `https://reduced.to/api/v1/shortener`.

## API Usage

| Method | Endpoint          | Content-Type | Request Body                            | Description                            |
|--------|-------------------|--------------|-----------------------------------------|----------------------------------------|
| POST   | /api/v1/shortener | application/json | `{"originalUrl": "https://google.com"}` | Shortens a URL and returns the result. |


To shorten a URL, make a `POST` request to the base URL with the following JSON payload:

POST /api/v1/shortener
Content-Type: application/json
```json
{
"originalUrl": "https://google.com"
}
```

Upon successful execution of the request, you will receive a JSON response containing the shortened URL. The response object will have the following structure:
```json

{
  "newUrl": "vv9ip"
}
```

## Javascript Example


```javascript
// Define the API endpoint
const url = 'https://reduced.to/api/v1/shortener';

// Define the original URL to be shortened
const originalUrl = 'https://google.com';

// Create the request payload
const payload = {
  originalUrl: originalUrl
};

// Send the POST request to shorten the URL
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(response => response.json())
  .then(data => {
    // Extract the shortened URL from the response
    const shortenedUrl = data.newUrl;

    // Print the shortened URL
    console.log(`Shortened URL: https://reduced.to/${shortenedUrl}`);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

  ```
  
# Python Example

```python
import requests
import json

# Define the API endpoint
url = 'https://reduced.to/api/v1/shortener'

# Define the original URL to be shortened
original_url = 'https://google.com'

# Create the request payload
payload = {
    'originalUrl': original_url
}

# Send the POST request to shorten the URL
response = requests.post(url, json=payload)

# Extract the shortened URL from the response
shortened_url = response.json()['newUrl']

# Print the shortened URL
print(f'Shortened URL: https://reduced.to/{shortened_url}')
```



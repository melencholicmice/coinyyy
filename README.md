# Coinyyy 📈💰

This project is a cryptocurrency price tracking application that provides real-time price updates for various cryptocurrencies.

## Technologies Used 🛠️

- Node.js: Backend runtime environment
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing cryptocurrency data
- Redis: In-memory data structure store for caching
- BullsMQ: Message queue for asynchronous processing
- CoinGecko API: External API for fetching cryptocurrency data
- Swagger: API documentation and testing tool
- TypeScript: Typed superset of JavaScript for enhanced development

## API Guide 🚀

### GET / 

Serves the Swagger UI documentation.

### POST /stats 

Get coin statistics by ID.

**Request Body:**


{
  "coin": "string"
}


**Responses:**
- 200: ✅ Successful response
- 400: ❌ Bad request

### POST /deviation 

Get standard deviation for coins.

**Request Body:**


{
  "coin": "string"
}


**Responses:**
- 200: ✅ Successful response
- 400: ❌ Bad request

## Caching System 🚀

The application implements a caching system to optimize performance and reduce the number of API calls:

The caching system is primarily implemented in two files:

1. `@src/middlewares/cacheApiResponse.ts`:
   This file contains a middleware function `cacheApiResponse` that handles caching of API responses. It uses Redis to store and retrieve cached data. The middleware checks if a cached response exists for a given request, and if so, returns it immediately. If not, it caches the response for future use. The caching duration can be either fixed or dynamic based on the latest coin record time.

2. `@src/utils/LatestCoinRecord.ts`:
   This file defines a `LatestCoinRecordManager` class that manages the latest coin records in Redis. It provides methods to set and get the latest coin record times, as well as calculate time differences. This is used to implement dynamic caching durations based on the freshness of coin data.

Together, these components ensure efficient caching and data freshness in the cryptocurrency price tracking application.

## Getting Started 🚀

1. Clone the repository:
   
   git clone https://github.com/your-username/crypto-price-tracker.git
   cd crypto-price-tracker
   
2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/crypto_tracker
     REDIS_URL=redis://localhost:6379
     COINGECKO_API_KEY=your_coingecko_api_key
     

3. Install dependencies:
   
   npm install
   

4. Start the application:
   
   docker-compose up
   

5. Access the API documentation:
   Open your browser and navigate to `http://localhost:3000/` to view the Swagger documentation.

Happy tracking! 🎉

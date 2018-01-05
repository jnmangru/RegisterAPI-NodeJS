 # Basic description
RESTful API that interacts with a PostgreSQL database. Implemented in NodeJS with typescript, restify, and pg-promise. Edited in Visual Studio Code.  
  
Be sure to modify the `./app/config/config.ts` file with your server port and database configuration if connecting to a local database or `./app/models/repositories/helpers/databaseConnection.ts` with your Heroku credentials if running locally but connecting to a database on Heroku's servers.  
  
To start via the terminal navigate to the source code directory and run the following commands...  
`$ npm install`  
`$ npm run compile`  
`$ npm run start`  

 # Example HTTP requests via cURL (be sure to update as needed)
 ## Create a product
`curl -i -s -H "Content-Type: application/json" -X POST -d '{"lookupCode":"lookupcode4","count":175}' https://uarkregserv.herokuapp.com/api/product/`  
 ## Update an existing product by record ID
`curl -i -s -H "Content-Type: application/json" -X PUT -d '{"id":"bee20aed-5245-46a7-b19c-9ef6abd4ca5c","lookupCode":"lookupcode4","count":200}' https://uarkregserv.herokuapp.com/api/product/bee20aed-5245-46a7-b19c-9ef6abd4ca5c`  
 ## Delete an existing product by record ID
`curl -i -s -X DELETE https://uarkregserv.herokuapp.com/api/product/bee20aed-5245-46a7-b19c-9ef6abd4ca5c`  

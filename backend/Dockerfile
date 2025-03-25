# Step 1: Use the official Node.js image as the base
FROM node:current-alpine3.21

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the entire project
COPY . .

# RUN npm run migrate

# Step 6: Expose the port the app will run on
EXPOSE 3000

# Step 7: Set the command to run the Fastify server
CMD ["npm", "start"]

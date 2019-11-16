# Installing Packages

Let's first setup node and install needed packages:

```
nvm use stable
npm init
npm install express mongoose multer
```

We'll be using Express for the REST API. We'll use Mongoose to provide an object interface for the Mongo database. And we'll use multer to help us upload images.

We should now be able to run the application. First, start Mongo. If you have it running already, dont do anything.

You can start it manually:

```
mongod --config /usr/local/etc/mongod.conf
```

or you can run it as a service on MacOS:

```
brew services list
brew services start mongodb-community@4.0
```

[See the documentation for Windows](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-windows/).

Once Mongo is running, then you can run the node server:

```
node server.js
```

This will start on port 3000, and you can browse to yourserver:3000.

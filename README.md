# Northcoders News API

This project is my backend project as part of my time with Northcoders and will form the basis for my frontend project. 

The app looks to provide a similar service to reddit and you can find a hosted verison of the project here: 

https://nc-news-5sxy.onrender.com/

To setup the project, you will need clone the repo from 

https://github.com/Willo84uk/nc-news

you should then install dependencies to your machine by running

$ npm install

you should then create two .env files:

.env.test
.env.development

Into each of these files you will need to add the following:

PGDATABASE=(YOUR DATABASE NAME HERE)

Ensure you use the correct database name for that environment, review /db/setup.sql for the default database names.

If you choose to use alternate db names then ensure these are used in the appropriate .env files.

finally to you should seed the local database

$ npm seed

and to run tests whilst working with this project

$ npm test
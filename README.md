### PostgreSQL application

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## FrontEnd Module
```
$ npm install bootstrap
```
```
$ npm install reactstrap
```
```
$ npm install react-router-dom
```
```
$ npm install react-bootstrap
```
```
$ npm install --save-dev "node-sass@^4.0.0" "typescript@^3.2.1" "sass@^1.3.0" "fibers@>= 3.1.0"
>to avoid npm warning
```
```
$ npm install axios
```
```
$ npm install react-player
```
#### Notice

> BackEnd module is stored within `sedative-backend` folder:

* remember adding `"server": "nodemon server.js"` under `"scripts"` in `package.json` inside `nodejs` folder; 
* in `package.json` this folder, adding `"proxy": "http://localhost:5011"` alongside with `"devDependencies"` same layer;
* then running *npm run server*; server listen to port 5011

> storagelist.JSON is database, storing play parameters, relevant article please refer to [Read/Write JSON Files with Node.js](https://medium.com/@osiolabs/read-write-json-files-with-node-js-92d03cc82824)

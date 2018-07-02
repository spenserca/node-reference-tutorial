const Koa = require('koa');

const app = new Koa();

app.use(require('./hello')); //this is the handler we just created
app.listen(3000);

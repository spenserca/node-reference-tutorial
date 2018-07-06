const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const jwt = require('koa-jwt');
const jwksRsa = require('jwks-rsa');

const app = new Koa();

app.use(createAuthMiddleware().unless({path: '/hello'}));
app.use(bodyParser());
app.use(buildRouter().routes());
app.listen(3000);

function buildRouter() {
    const router = new Router();
    router.get('/hello', require('./hello'));
    router.post('/products', require('./products/createProduct'));
    return router;
}

function createAuthMiddleware() {
    let userPoolId = process.env.USER_POOL_ID || 'us-east-2_Vy7cnPhVi';
    return jwt({
        secret: jwksRsa.koaJwtSecret({
            cache: true,
            jwksUri: `https://cognito-idp.us-east-2.amazonaws.com/${userPoolId}/.well-known/jwks.json`
        }),
        algorithms: ['RS256']
    });
}

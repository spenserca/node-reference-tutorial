const shortid = require('shortid');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const documentClient = new AWS.DynamoDB.DocumentClient();
const productsTableName = process.env.PRODUCTS_TABLE_NAME;
const validateProduct = require('./validateProduct');

module.exports = async function createProduct(ctx) {
    const product = ctx.request.body;

    const validationErrors = validateProduct(product);
    if (validationErrors) {
        ctx.body = validationErrors;
        ctx.status = 400;
        return;
    }

    product.id = shortid.generate();
    product.lastModified = new Date(Date.now()).toISOString();
    await saveProduct(product);
    ctx.body = product;
};

async function saveProduct(product) {
    return await documentClient
        .put({
            TableName: productsTableName,
            Item: product
        })
        .promise();
}

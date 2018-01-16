const requests = require('./requests');

module.exports.lambda = (e, context, callback) => {
  const address = e.queryStringParameters.address;
  requests.getParcelID(address)
    .then(requests.getTrashDay)
    .then(trashDay => {
      return {
        statusCode: 200,
        data: { trashDay }
      };
    })
    .catch(error => {
      return {
        statusCode: 400,
        data: { error }
      };
    })
    .then(({ statusCode, data }) => {
      callback(null, {
        statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      });
    });
};

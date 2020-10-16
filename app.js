const express = require('express');
const app = express();
const port = 5000;

const SplitFactory = require('@splitsoftware/splitio').SplitFactory;

const factory = SplitFactory({
  core: {
    authorizationKey: '<your split api key>'
  }
});

const client = factory.client();

app.use(express.json());

app.listen(port, () => {
  console.log(`Horror movie app is running on port ${port}.`);
});

const treatmentMiddleware = function (request, response, next) {
    const userEmail = request.headers['authorization'];
    request.treatment = client.getTreatment(userEmail, 'database_split');
    next();
};
  

const api = require('./api');

app.get('/horrors/', treatmentMiddleware, api.getAllHorrors);
app.get('/horrors/:id', treatmentMiddleware, api.getHorrorById);
app.post('/horrors/', treatmentMiddleware, api.addHorror);
app.put('/horrors/:id', treatmentMiddleware, api.updateHorror);
app.delete('/horrors/:id', treatmentMiddleware, api.deleteHorror);

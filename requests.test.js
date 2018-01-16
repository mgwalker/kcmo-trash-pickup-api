const tap = require('tap');
const sinon = require('sinon');

const requests = require('./requests');

tap.test('gets the parcel ID for a given address', parcelIDTests => {
  const request = sinon.stub();
  parcelIDTests.beforeEach(done => {
    request.reset();
    done();
  });

  parcelIDTests.test('cleans up input address', cleanupTests => {
    request.resolves({
      body: '{ "features": [{ "attributes": { "PIN": "Hello"  }}]}'
    });

    const awaiting = [];

    awaiting.push(requests.getParcelID('123 #Addr&es!!s St.', request)
      .then(parcelID => {
        cleanupTests.ok(request.calledWith(`http://maps.kcmo.org/kcgis/rest/services/external/AddressSearch/MapServer/0/query?f=JSON&where=ADDR=123 AND CONCAT LIKE '123 ADDRESS ST%'&outFields=PIN&`), 'removes punctuation from address');
      })
    );

    [
      { long: 'Avenue', short: 'Ave', expected: 'AVE'},
      { long: 'Lane', short: 'Ln', expected: 'LN' },
      { long: 'Parkway', short: 'Pkway', expected: 'PKWAY' },
      { long: 'Road', short: 'Rd', expected: 'RD' },
      { long: 'Street', short: 'St', expected: 'ST' },
      { long: 'Terrace', short: 'Ter', expected: 'TER' },
      { long: 'The Paseo', short: 'Paseo', expected: 'PASEO' }
    ].forEach(testCase => {
      awaiting.push(requests.getParcelID(`123 Address ${testCase.long}`, request)
        .then(parcelID => {
          cleanupTests.ok(request.calledWith(`http://maps.kcmo.org/kcgis/rest/services/external/AddressSearch/MapServer/0/query?f=JSON&where=ADDR=123 AND CONCAT LIKE '123 ADDRESS ${testCase.expected}%'&outFields=PIN&`), `changes "${testCase.long}" to "${testCase.short}"`);
        })
      );
    });

    Promise.all(awaiting).then(() => cleanupTests.done());
  });

  parcelIDTests.test('calls the expected KCMO API URL with the given address', test => {
    request.resolves({
      body: '{ "features": [{ "attributes": { "PIN": "Hello"  }}]}'
    });

    requests.getParcelID('123 Address St', request)
      .then(parcelID => {
        test.ok(request.calledWith(`http://maps.kcmo.org/kcgis/rest/services/external/AddressSearch/MapServer/0/query?f=JSON&where=ADDR=123 AND CONCAT LIKE '123 ADDRESS ST%'&outFields=PIN&`), 'calls the expected URL');
        test.equal(parcelID, 'Hello', 'returns PIN from response body');
        test.done();
      });
  });

  parcelIDTests.done();
});

tap.test('gets the trash pickup day for a given parcel ID', trashPickupDayTests => {
  const request = sinon.stub().resolves({
    body: '{ "features": [{ "attributes": { "TRASHDAY": "the day it happens"  }}]}'
  });

  requests.getTrashDay('parcel-id', request)
    .then(day => {
      trashPickupDayTests.ok(request.calledWith(`http://maps.kcmo.org/kcgis/rest/services/external/Tables/MapServer/2/query?f=JSON&where=KIVA_PIN='parcel-id'&outFields=TRASHDAY&`), 'calls the expected URL');
      trashPickupDayTests.equal(day, 'the day it happens', 'returns the day from the response body');
      trashPickupDayTests.done();
    });
});

const needle = require('needle');

const kcmoAPIbase = 'http://maps.kcmo.org/kcgis/rest/services/external';

module.exports.getParcelID = (address, request = needle) => {
  const addressBits = address.match(/^([0-9]+)\s.+$/);
  const fullAddress = address
    .toUpperCase()
    .replace(/[^0-9A-Z\s]/g, '')
    .replace('AVENUE', 'AVE')
    .replace('LANE', 'LN')
    .replace('PARKWAY', 'PKWAY')
    .replace('ROAD', 'RD')
    .replace('STREET', 'ST')
    .replace('TERRACE', 'TER')
    .replace('THE PASEO', 'PASEO');

  const qs = {
    f: 'JSON',
    where: `ADDR=${addressBits[1]} AND CONCAT LIKE '${fullAddress}%'`,
    outFields: 'PIN'
  };

  const qstring = Object.keys(qs).reduce((qstring, param) =>
    `${qstring}${param}=${qs[param]}&`
  , '');

  return request(`${kcmoAPIbase}/AddressSearch/MapServer/0/query?${qstring}`)
    .then(response => {
      const body = JSON.parse(response.body);
      return body.features[0].attributes.PIN;
    });
};

module.exports.getTrashDay = (parcelID, request = needle) => {
  const qs = {
    f: 'JSON',
    where: `KIVA_PIN='${parcelID}'`,
    outFields: 'TRASHDAY'
  };

  const qstring = Object.keys(qs).reduce((qstring, param) =>
    `${qstring}${param}=${qs[param]}&`
  , '');

  return request(`${kcmoAPIbase}/Tables/MapServer/2/query?${qstring}`)
    .then(response => {
      const body = JSON.parse(response.body);
      return body.features[0].attributes.TRASHDAY;
    });
};

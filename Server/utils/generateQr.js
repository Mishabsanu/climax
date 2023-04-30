const QRCode = require('qrcode');

const generateQR = async text => {
  try {
    console.log('generate qr',text)
    return await QRCode.toDataURL(text);
  } catch (err) {
    return console.error(err);
  }
};

module.exports = generateQR;
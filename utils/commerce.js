var Commerce = require('@chec/commerce.js');
let commerce = null;

function getCommerce(commercePublicKey) {
  if (commerce) {
    return commerce;
  } else {
    const publicKey = commercePublicKey || process.env.COMMERCE_PUBLIC_KEY;
    const devEnvironment = process.env.NODE_ENV === "development";

    if (devEnvironment && !publicKey ) {
      throw Error("--- Commerce public API key not been found");
    }
    console.log('publicKey:', publicKey)
    console.log('devEnvironment:', devEnvironment)

    commerce = new Commerce(publicKey, devEnvironment);
    return commerce;
  }
}

export default getCommerce;
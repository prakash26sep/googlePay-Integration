import React from "react";
// import "./styles.css";

const allowedNetworks = ['VISA', 'MASTERCARD'];
const allowedAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedCardNetworks: allowedNetworks,
    allowedAuthMethods: allowedAuthMethods
  }
};

const googlePayBaseConfiguration = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [baseCardPaymentMethod]
};


const { googlePayClient } = window;

googlePayClient.isReadyToPay(googlePayBaseConfiguration)
  .then(function (response) {
    if (response.result) {
      createAndAddButton();
    } else {
      alert("Unable to pay using Google Pay");
    }
  }).catch(function (err) {
    console.error("Error determining readiness to use Google Pay: ", err);
  });


function createAndAddButton() {

  const googlePayButton = googlePayClient.createButton({

    buttonColor: 'default',
    buttonType: 'long',

    onClick: onGooglePaymentsButtonClicked
  });

  document.getElementById('buy-now').appendChild(googlePayButton);
}


function onGooglePaymentsButtonClicked() {

  const tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
      gateway: 'example',
      gatewayMerchantId: 'exampleGatewayMerchantId'
    }
  };

  const cardPaymentMethod = {
    type: 'CARD',
    tokenizationSpecification: tokenizationSpecification,
    parameters: {
      allowedCardNetworks: ['VISA', 'MASTERCARD'],
      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
      billingAddressRequired: true,
      billingAddressParameters: {
        format: 'FULL',
        phoneNumberRequired: true
      }
    }
  };

  const transactionInfo = {
    totalPriceStatus: 'FINAL',
    totalPrice: '10.00',
    currencyCode: 'INR',
    countryCode: 'IN'
  };

  const merchantInfo = {
    // merchantId: '', 
    merchantName: 'PRAKASH SAIN'
  };

  const paymentDataRequest = Object.assign({}, googlePayBaseConfiguration, {
    allowedPaymentMethods: [cardPaymentMethod],
    transactionInfo: transactionInfo,
    merchantInfo: merchantInfo
  });

  googlePayClient
    .loadPaymentData(paymentDataRequest)
    .then(function (paymentData) {
      processPayment(paymentData);
    }).catch(function (err) {
    });
}

function processPayment(paymentData) {

  console.log(paymentData);

  return new Promise(function (resolve, reject) {

    const paymentToken = paymentData.paymentMethodData.tokenizationData.token;
    console.log('token:' + paymentToken);

    // after this i will send post request to backend

    setTimeout(function () {

      alert('chal gyaaa');
      resolve({});
    }, 800);
  });
}

export default function App() {


  return (
    <div className="App">
      <div id="buy-now"></div>
    </div>
  );
}
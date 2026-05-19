async function sendSMS(to, message){

  console.log("========== SMS SENT ==========");

  console.log("TO:", to);

  console.log("MESSAGE:", message);

  console.log("==============================");

  return {
    success: true
  };

}

module.exports = sendSMS;
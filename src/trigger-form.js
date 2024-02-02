function Submit() {
  //  add your discord Webhook Endpoint
  const webhooks = "";

  const form = FormApp.getActiveForm();
  const allResponses = form.getResponses();
  const latestResponse = allResponses[allResponses.length - 1];
  const response = latestResponse.getItemResponses();
  const email = latestResponse.getRespondentEmail();
  // let content = "";
  let discordId = "";
  let gender = "";
  let userGender = "";

  for (var i = 0; i < response.length; i++) {
    const question = response[i].getItem().getTitle();
    const answer = response[i].getResponse();
    // content += `${question}\n${answer}\n`;
    if (question === "DiscordTag") {
      discordId = answer;
    }
    if (question === "Giới tính") {
      gender = answer;
      console.log(gender);
      if (gender !== "Nam") {
        userGender = "female";
      } else {
        userGender = "male";
      }
    }
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    muteHttpExceptions: false,
    payload: JSON.stringify({
      content: `newRegistrationWhitelist_${discordId}:${userGender}`,
      // embeds: [
      //   {
      //     title: form.getTitle(),
      //     description: content,
      //     timestamp: new Date().toISOString(),
      //   },
      // ],
    }),
  };
  try {
    UrlFetchApp.fetch(webhooks, options);
  } catch (error) {
    console.log(error);
  }
}

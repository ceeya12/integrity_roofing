"strict";

////////////////////////
//Contact us page
//Get in touch buttton

const redTouchBtn = document.getElementById("contactUsBtn");

const scrollToContact = function (event) {
  //   event.preventDefault();
  //window.scrollTo(X,Y)
  window.scrollTo(0, 700);
};

redTouchBtn.addEventListener("click", scrollToContact);

const submitBtnContact = document.getElementById("submitContact");

function sendMailContact() {
  const params = {
    firstName: document.getElementById("firstNameContact").value,
    lastName: document.getElementById("lastNameContact").value,
    email: document.getElementById("email_id").value,
    phoneNumber: document.getElementById("phone").value,
    message: document.getElementById("messageId").value,
  };

  const serviceID = "service_nvhdmbv";
  const templateID = "template_302h2sr";

  emailjs
    .send(serviceID, templateID, params)
    .then((res) => {
      document.getElementById("firstNameContact").value = "";
      document.getElementById("lastNameContact").value = "";
      document.getElementById("email_id").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("messageId").value = "";

      console.log(res);
      alert("Your message has been sent successfully");
    })
    .catch((err) => console.log(err));
}

submitBtnContact.addEventListener("click", function (e) {
  e.preventDefault();

  sendMailContact();
});

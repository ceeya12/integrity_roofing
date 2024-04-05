"strict";

const submitBtn = document.getElementById("submit");

function sendMail() {
  const params = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    email: document.getElementById("email").value,
    zipCode: document.getElementById("zipCode").value,
    message: document.getElementById("message").value,
  };

  const serviceID = "service_nvhdmbv";
  const templateID = "template_pa6wfwu";

  emailjs
    .send(serviceID, templateID, params)
    .then((res) => {
      document.getElementById("firstName").value = "";
      document.getElementById("lastName").value = "";
      document.getElementById("phoneNumber").value = "";
      document.getElementById("email").value = "";
      document.getElementById("zipCode").value = "";
      document.getElementById("message").value = "";

      console.log(res);
      alert("Your message has been sent successfully");
    })
    .catch((err) => console.log(err));
}

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();

  sendMail();
});

/////////////////////
//Functionality to click on "Get in touch button" and redirect to Contact Request
//main landing page

const contactUS = document.getElementById("contactClick");
const touchBtn = document.getElementById("touchBtn");

const scrollToContact = function (event) {
  event.preventDefault();
  //window.scrollTo(X,Y)
  window.scrollTo(0, 5000);
};

contactUS.addEventListener("click", scrollToContact);
touchBtn.addEventListener("click", scrollToContact);

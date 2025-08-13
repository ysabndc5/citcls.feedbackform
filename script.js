document.addEventListener("DOMContentLoaded", function () {

  // ===== Date/Time Display =====
  const dtElement = document.getElementById("dateTimeDisplay");
  function updateDateTimeDisplay() {
    const now = new Date();
    const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString();
    if (dtElement) dtElement.textContent = `${date} | ${time}`;
  }
  if (dtElement) {
    updateDateTimeDisplay();           // show immediately
    setInterval(updateDateTimeDisplay, 1000); // update every second
  }

  // ===== Initialize EmailJS =====
  if (typeof emailjs !== "undefined") {
    emailjs.init("W-OJHfM_Oe9kVDIqN");
  } else {
    console.error("EmailJS is not loaded!");
  }

  // ===== Form Submission =====
  const surveyForm = document.getElementById("surveyForm");
  if (!surveyForm) return;

  surveyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(surveyForm);
    const submissionDateTime = new Date().toLocaleString();

    const staffRating = surveyForm.querySelector('input[name="staffRating"]:checked');
    const overallRating = surveyForm.querySelector('input[name="overallRating"]:checked');

    const surveyData = {
      visitorType: formData.get("visitorType") || "",
      name: formData.get("name") || "",
      purpose: formData.get("purpose") || "",
      date: submissionDateTime,
      staffRating: staffRating ? staffRating.value : "",
      concernAddressed: formData.get("concernAddressed") || "",
      overallRating: overallRating ? overallRating.value : "",
      recommend: formData.get("recommend") || "",
      comments: formData.get("comments") || "",
      email: formData.get("email") || ""
    };

    // ===== Save in localStorage =====
    const surveyList = JSON.parse(localStorage.getItem("surveyList") || "[]");
    surveyList.push(surveyData);
    localStorage.setItem("surveyList", JSON.stringify(surveyList));
    localStorage.setItem("lastSurvey", JSON.stringify(surveyData));
    if (surveyData.name) localStorage.setItem("feedbackName", surveyData.name);

    // ===== Prepare EmailJS template params =====
    const templateParams = {
      visitorType: surveyData.visitorType,
      name: surveyData.name || "Anonymous",
      purpose: surveyData.purpose,
      date: surveyData.date,
      staffRating: surveyData.staffRating,
      concernAddressed: surveyData.concernAddressed,
      overallRating: surveyData.overallRating,
      recommend: surveyData.recommend,
      comments: surveyData.comments,
      from_email: "citcls.office@gmail.com"
    };

    // ===== Send Email to survey taker =====
    if (surveyData.email) {
      emailjs.send("service_3llmtmq", "template_mnopc48", { ...templateParams, to_email: surveyData.email })
        .then(() => console.log("Survey sent to user ✅"))
        .catch(err => console.error("Error sending email to user:", err));
    }

    // ===== Send Email to admin =====
    emailjs.send("service_3llmtmq", "template_mnopc48", { ...templateParams, to_email: "citcls.office@gmail.com" })
      .then(() => console.log("Survey sent to admin ✅"))
      .catch(err => console.error("Error sending email to admin:", err));

    // ===== Redirect to thank you page =====
    window.location.href = "thankyou.html";

  });

});

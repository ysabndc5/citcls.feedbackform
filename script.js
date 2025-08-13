document.addEventListener("DOMContentLoaded", function () {

  // ===== Date/Time Display =====
  function updateDateTimeDisplay() {
    const now = new Date();
    const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString();
    const dtElement = document.getElementById("dateTimeDisplay");
    if (dtElement) dtElement.textContent = `${date} | ${time}`;
  }

  updateDateTimeDisplay();           
  setInterval(updateDateTimeDisplay, 1000); 

    // ===== Form Submission =====
  const surveyForm = document.getElementById("surveyForm");

  if (surveyForm) {
    surveyForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const form = event.target;
      const formData = new FormData(form);

      const now = new Date();
      const submissionDateTime = now.toLocaleString();

      const staffRating = form.querySelector('input[name="staffRating"]:checked');
      const overallRating = form.querySelector('input[name="overallRating"]:checked');

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

      // Save to localStorage
      const surveyList = JSON.parse(localStorage.getItem("surveyList") || "[]");
      surveyList.push(surveyData);
      localStorage.setItem("surveyList", JSON.stringify(surveyList));
      localStorage.setItem("lastSurvey", JSON.stringify(surveyData));
      localStorage.setItem("feedbackName", surveyData.name);

       // Redirect to thank you page
      window.location.href = "thankyou.html";
    });
  }

});
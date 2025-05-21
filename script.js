document.getElementById("contact-form").addEventListener("submit", async function(e) {
  e.preventDefault(); // Prevent default form submission

  const form = this;
  const message = document.getElementById("form-message");
  message.textContent = "Sending...";

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      setTimeout(() => {
        message.textContent = "Thank you! Your message has been sent to Christopher.";
        form.reset();
      }, 1000); // Show a short delay for effect
    } else {
      message.textContent = "Sorry, there was a problem. Please try again.";
    }
  } catch (error) {
    message.textContent = "Network error. Please try again later.";
  }
});
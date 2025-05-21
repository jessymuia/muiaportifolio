// Preloader script for the whole page
window.addEventListener('load', function() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'none';
  }
});

// Contact form submission
document.getElementById("contact-form").addEventListener("submit", async function(e) {
  e.preventDefault(); // Prevent default form submission

  const form = this;
  const message = document.getElementById("form-message");
  message.innerHTML = '<span class="form-spinner"></span> Sending...'; // Spinner while sending

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

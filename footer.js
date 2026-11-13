
// ==========================================
// DAILYKART FOOTER JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // AUTOMATIC YEAR
  const yearElement =
    document.getElementById("dkFooterYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // NEWSLETTER
  const newsletterForm =
    document.getElementById("dkNewsletterForm");

  const newsletterStatus =
    document.getElementById("dkNewsletterStatus");

  if (newsletterForm && newsletterStatus) {

    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      newsletterStatus.textContent =
        "Newsletter signup is coming soon!";
    });

  }

});

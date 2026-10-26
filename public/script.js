const form = document.getElementById("trackingForm");
const input = document.getElementById("trackingInput");
const loadingBox = document.getElementById("loadingBox");
const errorBox = document.getElementById("errorBox");
const resultCard = document.getElementById("resultCard");

const steps = [
  document.getElementById("step-booked"),
  document.getElementById("step-transit"),
  document.getElementById("step-out"),
  document.getElementById("step-delivered")
];
const lines = [
  document.getElementById("line-1"),
  document.getElementById("line-2"),
  document.getElementById("line-3")
];

// Search when the form is submitted
form.addEventListener("submit", event => {
  event.preventDefault();
  searchCourier(input.value.trim());
});

// Sample buttons fill in the tracking ID and search automatically
document.querySelectorAll(".chip").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.id;
    searchCourier(input.value);
  });
});

async function searchCourier(trackingId) {
  if (!trackingId) {
    showError("Input Required", "Please enter a Tracking ID before searching.");
    return;
  }

  loadingBox.classList.remove("hidden");
  errorBox.classList.add("hidden");
  resultCard.classList.add("hidden");

  try {
    const response = await fetch(`/api/courier/${encodeURIComponent(trackingId)}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      showError("Courier Not Found", result.message || "No shipment found for this ID.");
      return;
    }

    showCourier(result.data);
  } catch (error) {
    showError("Server Connection Failed", "Please start the Node.js server and try again.");
  } finally {
    loadingBox.classList.add("hidden");
  }
}

function showCourier(courier) {
  document.getElementById("displayTrackingId").textContent = courier.trackingId;
  document.getElementById("displaySender").textContent = courier.sender;
  document.getElementById("displayReceiver").textContent = courier.receiver;
  document.getElementById("displayDestination").textContent = courier.destination;
  document.getElementById("displayExpectedDate").textContent =
    new Date(courier.expectedDeliveryDate + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  document.getElementById("displayCurrentStatus").textContent = courier.status;

  const badge = document.getElementById("displayStatusBadge");
  badge.textContent = courier.status;
  badge.className = "status-badge";

  let currentStep = 0;
  if (courier.status === "In Transit") currentStep = 1;
  if (courier.status === "Out for Delivery") currentStep = 2;
  if (courier.status === "Delivered") currentStep = 3;

  const badgeClasses = ["badge-booked", "badge-transit", "badge-out", "badge-delivered"];
  badge.classList.add(badgeClasses[currentStep]);

  steps.forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (index < currentStep || courier.status === "Delivered") {
      step.classList.add("completed");
    } else if (index === currentStep) {
      step.classList.add("active");
    }
  });

  lines.forEach((line, index) => {
    line.classList.toggle("active", index < currentStep || courier.status === "Delivered");
  });

  errorBox.classList.add("hidden");
  resultCard.classList.remove("hidden");
  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showError(title, message) {
  document.getElementById("errorHeading").textContent = title;
  document.getElementById("errorMessageText").textContent = message;
  errorBox.classList.remove("hidden");
  resultCard.classList.add("hidden");
  errorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

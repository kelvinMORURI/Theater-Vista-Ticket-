document.addEventListener("DOMContentLoaded", function () {
    const seats = document.querySelectorAll(".seat");
    const selectedCountElement = document.getElementById("modal-selected-count");
    const totalCostElement = document.getElementById("modal-total-cost");
    const ticketPriceDisplay = document.querySelectorAll("input[name='category']");
    
    let ticketPrice = 15; // Default price: Regular
    
    // Update ticket price based on selected category
    ticketPriceDisplay.forEach((radio) => {
      radio.addEventListener("change", () => {
        switch (radio.value) {
          case "VIP":
            ticketPrice = 20;
            break;
          case "Economy":
            ticketPrice = 10;
            break;
          default:
            ticketPrice = 15;
        }
        updateBilling();
      });
    });
    
    const bookBtn = document.querySelector(".book-btn");
    const modal = document.getElementById("confirmation-modal");
    const confirmBtn = document.getElementById("confirm-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    
    const reservedSeats = {}; // Stores reserved seats with timers
    
    // Add event listeners to seats
    seats.forEach((seat) => {
      seat.setAttribute("tabindex", "0"); // Enable keyboard selection
      seat.addEventListener("click", () => toggleSeatSelection(seat));
      seat.addEventListener("keydown", (e) => {
        if (e.key === "Enter") toggleSeatSelection(seat);
      });
    });
    
    function toggleSeatSelection(seat) {
      if (seat.classList.contains("reserved")) {
        return; // Don't allow selection of reserved seats
      }
      seat.classList.toggle("selected");
      updateBilling();
    }
    
    function updateBilling() {
      const selectedSeats = document.querySelectorAll(".seat.selected").length;
      const totalCost = selectedSeats * ticketPrice;
      selectedCountElement.textContent = selectedSeats;
      totalCostElement.textContent = totalCost;
    }
    
    // Show confirmation modal when "Book Now" is clicked
    bookBtn.addEventListener("click", () => {
      const selectedSeats = document.querySelectorAll(".seat.selected").length;
    
      if (selectedSeats === 0) {
        alert("Please select at least one seat before booking.");
        return;
      }
    
      document.getElementById("modal-selected-count").textContent = selectedSeats;
      document.getElementById("modal-total-cost").textContent = selectedSeats * ticketPrice;
      modal.style.display = "flex"; // Show modal
    });
    
    // Confirm booking
    confirmBtn.addEventListener("click", () => {
      alert("Booking confirmed!");
      modal.style.display = "none";
    
      // Mark selected seats as reserved
      document.querySelectorAll(".seat.selected").forEach((seat) => {
        seat.classList.remove("selected");
        seat.classList.add("reserved");
        startTimer(seat);
      });
    
      updateBilling();
      updateSeatAvailability();
    });
    
    // Cancel booking
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none"; // Hide modal
    });
    
    // Close modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
    
    // Start timer for reserved seats
    function startTimer(seat) {
      const seatNumber = seat.getAttribute("data-seat");
      const timer = setTimeout(() => {
        seat.classList.remove("reserved");
        alert(`Seat ${seatNumber} reservation expired!`);
        updateSeatAvailability();
      }, 600000); // 10 minutes
    
      reservedSeats[seatNumber] = timer;
    }
    
    // Update seat availability in localStorage
    function updateSeatAvailability() {
      const availableSeats = {};
      document.querySelectorAll(".seat").forEach((seat) => {
        if (seat.classList.contains("reserved")) {
          availableSeats[seat.getAttribute("data-seat")] = true;
        } else {
          availableSeats[seat.getAttribute("data-seat")] = false;
        }
      });
      localStorage.setItem("availableSeats", JSON.stringify(availableSeats));
    }
    
    // Load real-time availability from localStorage
    function loadSeatAvailability() {
      const availableSeats = JSON.parse(localStorage.getItem("availableSeats")) || {};
      document.querySelectorAll(".seat").forEach((seat) => {
        const seatNumber = seat.getAttribute("data-seat");
        if (availableSeats[seatNumber]) {
          seat.classList.add("reserved");
        } else {
          seat.classList.remove("reserved");
        }
      });
    }
    
    loadSeatAvailability();
  });
  
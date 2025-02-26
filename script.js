document.addEventListener("DOMContentLoaded", function () {
  const seatContainer = document.getElementById("seat-container");
  const selectedSeatsText = document.getElementById("selected-seats");
  const totalPriceText = document.getElementById("total-price");

  const rows = 5; // Number of rows
  const cols = 5; // Number of columns
  const seatPrice = 10; // Price per seat
  let selectedSeats = 0;
  let totalPrice = 0;

  // Generate seats dynamically
  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
          const seat = document.createElement("div");
          seat.classList.add("seat", "available");
          seat.innerText = `R${i + 1}C${j + 1}`; // Seat numbering

          // Randomly reserve some seats
          if (Math.random() < 0.2) {
              seat.classList.remove("available");
              seat.classList.add("reserved");
          }

          // Seat click event
          seat.addEventListener("click", function () {
              if (seat.classList.contains("reserved")) return;

              if (seat.classList.contains("selected")) {
                  seat.classList.remove("selected");
                  seat.classList.add("available");
                  selectedSeats--;
                  totalPrice -= seatPrice;
              } else {
                  seat.classList.remove("available");
                  seat.classList.add("selected");
                  selectedSeats++;
                  totalPrice += seatPrice;
              }

              // Update UI
              selectedSeatsText.innerText = selectedSeats;
              totalPriceText.innerText = totalPrice;
          });

          seatContainer.appendChild(seat);
      }
  }

  // Booking Button Click
  document.getElementById("book-btn").addEventListener("click", function () {
      if (selectedSeats === 0) {
          alert("Please select at least one seat.");
      } else {
          alert(`You have booked ${selectedSeats} seat(s) for $${totalPrice}`);
      }
  });
});

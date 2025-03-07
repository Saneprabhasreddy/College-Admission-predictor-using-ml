/*************************************************
 * CAROUSEL FUNCTIONALITY (HOME PAGE)
 *************************************************/
let slideIndex = 0;
let slides = document.getElementsByClassName("slide");
let prevButton = document.querySelector(".prev");
let nextButton = document.querySelector(".next");
let carouselInterval;

function showSlide(index) {
  if (!slides || slides.length === 0) return;
  if (index >= slides.length) slideIndex = 0;
  if (index < 0) slideIndex = slides.length - 1;

  // Hide all slides
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  // Show current slide
  slides[slideIndex].style.display = "block";
}

function plusSlides(n) {
  slideIndex += n;
  showSlide(slideIndex);
}

function startCarousel() {
  carouselInterval = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 4000); // 4 seconds
}

function stopCarousel() {
  clearInterval(carouselInterval);
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  if (slides && slides.length > 0) {
    showSlide(slideIndex);
    startCarousel();
  }

  // Arrow events
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      stopCarousel();
      plusSlides(-1);
      startCarousel();
    });
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      stopCarousel();
      plusSlides(1);
      startCarousel();
    });
  }
});


/*************************************************
 * REST OF YOUR CODE (LOGIN, SIGNUP, PREDICTOR, ETC.)
 *************************************************/
// e.g. localStorage code, predictor code, contact form code...


/*************************************************
 * 2. LOCALSTORAGE HELPER FUNCTIONS
 *************************************************/
function getUsers() {
  let users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

/*************************************************
 * 3. SIGNUP FORM
 *************************************************/
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    let users = getUsers();
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      alert("Email already registered. Please log in.");
      return;
    }

    // Add new user
    users.push({ email, password });
    saveUsers(users);
    alert("Signup successful! You can now log in.");
    signupForm.reset();
  });
}

/*************************************************
 * 4. LOGIN FORM
 *************************************************/
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const users = getUsers();
    const existingUser = users.find(
      user => user.email === email && user.password === password
    );
    if (existingUser) {
      alert(`Login successful! Welcome, ${email}`);
      loginForm.reset();
      // You could redirect to predictor.html if you want
      // window.location.href = "predictor.html";
    } else {
      alert("Invalid email or password.");
    }
  });
}

/*************************************************
 * 5. PREDICTOR FORM
 *************************************************/
const collegeData = [
  {
    name: "College A",
    region: "Urban",
    fees: 100000,
    cutoffs: {
      CSE: { OC_BOYS: 15000, OC_GIRLS: 16000, SC_BOYS: 30000, SC_GIRLS: 32000 },
      ECE: { OC_BOYS: 18000, OC_GIRLS: 19000 },
    },
  },
  {
    name: "College B",
    region: "Rural",
    fees: 80000,
    cutoffs: {
      CSE: { OC_BOYS: 20000, OC_GIRLS: 21000, SC_BOYS: 40000, SC_GIRLS: 42000 },
      ECE: { OC_BOYS: 25000, OC_GIRLS: 26000 },
    },
  },
  {
    name: "College C",
    region: "Urban",
    fees: 120000,
    cutoffs: {
      EEE: { OC_BOYS: 15000, OC_GIRLS: 16000 },
      CSE: { OC_BOYS: 10000, OC_GIRLS: 11000 },
    },
  },
];
document.addEventListener("DOMContentLoaded", function () {
  const predictorForm = document.getElementById("predictor-form");

  if (predictorForm) {
    predictorForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const rank = parseInt(document.getElementById("rank").value.trim(), 10);
      const category = document.getElementById("categoryGender").value.trim();
      const branch = document.getElementById("branchCode").value.trim();
      const region = document.getElementById("region").value.trim();

      if (!rank || !category || !branch || !region) {
        alert("Please fill all fields correctly.");
        return;
      }

      // Prepare form data to send to Flask
      let formData = new FormData();
      formData.append("rank", rank);
      formData.append("categoryGender", category);
      formData.append("branchCode", branch);
      formData.append("inst_reg", region);

      fetch("/predict", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const college = data["data"][0];
          if (!college) {
            alert("No colleges found for your inputs. Try a different rank, category, or branch.");
          } else {
            let message = "Colleges you may get:\n\n";
            message += `  Name: ${college["NAME OF THE INSTITUTION"]}\n`;
            message += `  Code: ${college["INSTCODE"]}\n`;
            message += `  Type: ${college["TYPE"]}\n`;
            message += `  Fee: ₹${college["COLLEGE FEE"]}\n\n`;

            alert(message);
          }
        })
        .catch((error) => console.error("Error:", error));

      predictorForm.reset();
    });
  }
});



/*************************************************
 * 6. CONTACT FORM
 *************************************************/
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      alert("Please fill all fields.");
      return;
    }

    // Demo - just an alert
    alert(`Message Sent!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    contactForm.reset();
  });
}

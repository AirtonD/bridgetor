// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const mainNav = document.querySelector(".main-nav");

	if (mobileMenuBtn && mainNav) {
		mobileMenuBtn.addEventListener("click", function () {
			mainNav.classList.toggle("active");
			this.classList.toggle("active");
		});
	}

	// Close mobile menu when clicking on a link
	const navLinks = document.querySelectorAll(".main-nav a");
	for (const link of navLinks) {
		link.addEventListener("click", () => {
			mainNav.classList.remove("active");
			mobileMenuBtn.classList.remove("active");
		});
	}

	// Smooth scrolling for anchor links
	const anchorLinks = document.querySelectorAll('a[href^="#"]');
	for (const anchor of anchorLinks) {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();

			const targetId = this.getAttribute("href");
			if (targetId === "#") return;

			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop - 80,
					behavior: "smooth",
				});
			}
		});
	}

	// Specialist Filters
	const filterBtns = document.querySelectorAll(".filter-btn");
	const specialistCards = document.querySelectorAll(".specialist-card");

	for (const btn of filterBtns) {
		btn.addEventListener("click", function () {
			// Remove active class from all buttons
			for (const b of filterBtns) b.classList.remove("active");

			// Add active class to clicked button
			this.classList.add("active");

			const filter = this.getAttribute("data-filter");

			for (const card of specialistCards) {
				if (filter === "all" || card.getAttribute("data-category") === filter) {
					card.style.display = "block";
				} else {
					card.style.display = "none";
				}
			}
		});
	}

	// Toggle Mentor Fields
	const professionalRadio = document.getElementById("professional");
	const mentorRadio = document.getElementById("mentor");
	const mentorFields = document.getElementById("mentor-fields");

	if (professionalRadio && mentorRadio && mentorFields) {
		// Initial check
		mentorFields.style.display = mentorRadio.checked ? "block" : "none";

		// Add event listeners
		professionalRadio.addEventListener("change", () => {
			mentorFields.style.display = "none";
		});

		mentorRadio.addEventListener("change", () => {
			mentorFields.style.display = "block";
		});
	}

	// Firebase & Firestore Integration
	let firebaseApp = null;
	let firestoreDb = null;

	async function initFirebase() {
		if (!firebaseApp) {
			const { initializeApp } = await import(
				"https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js"
			);
			const { getFirestore, collection, addDoc } = await import(
				"https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js"
			);
			const firebaseConfig = {
				apiKey: "AIzaSyAQMPeMWFbMMil-McKtzYm1ZKv_wgs0-YQ",
				authDomain: "bridgetor-sw.firebaseapp.com",
				projectId: "bridgetor-sw",
				storageBucket: "bridgetor-sw.firebasestorage.app",
				messagingSenderId: "371595574152",
				appId: "1:371595574152:web:b383eacdb4df37dacc183d",
			};
			firebaseApp = initializeApp(firebaseConfig);
			firestoreDb = getFirestore(firebaseApp);
			// Attach Firestore helpers to window for reuse
			window._firestore = { collection, addDoc };
		}
	}

	// Pre-registration Form Submission
	const preRegistrationForm = document.getElementById("pre-registration-form");
	const successModal = document.getElementById("success-modal");
	const pixModal = document.getElementById("pix-modal");

	if (preRegistrationForm) {
		preRegistrationForm.addEventListener("submit", async function (e) {
			e.preventDefault();
			await initFirebase();
			const { collection, addDoc } = window._firestore;
			// Gather form data
			const formData = new FormData(preRegistrationForm);
			const data = Object.fromEntries(formData.entries());
			// Add timestamp
			data.submittedAt = new Date().toISOString();
			try {
				await addDoc(collection(firestoreDb, "preRegistrations"), data);
			} catch (err) {
				alert(`Erro ao enviar para o Firestore: ${err}`);
				return;
			}
			// Check if mentor is selected
			const isMentor = document.getElementById("mentor").checked;
			// In a real implementation, you would send the form data to a server
			if (isMentor) {
				// For mentors, show success modal directly
				if (successModal) {
					successModal.classList.add("active");
				}
			} else {
				// For professionals, show PIX payment modal
				if (pixModal) {
					pixModal.classList.add("active");
				}
			}
			// Reset form
			this.reset();
			// Hide mentor fields if they were visible
			if (mentorFields) {
				mentorFields.style.display = "none";
			}
		});
	}

	// PIX Modal Close Buttons
	const closePixModalBtns = document.querySelectorAll(
		".close-pix-modal, .cancel-pix",
	);
	for (const btn of closePixModalBtns) {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			if (pixModal) {
				pixModal.classList.remove("active");
			}
		});
	}

	// PIX Payment Confirmation
	const pixConfirmBtn = document.querySelector(".pix-btn");
	if (pixConfirmBtn) {
		pixConfirmBtn.addEventListener("click", () => {
			if (pixModal) {
				pixModal.classList.remove("active");
			}
			if (successModal) {
				successModal.classList.add("active");
			}
		});
	}

	// Copy PIX Code Functionality
	const copyPixCodeBtn = document.getElementById("copy-pix-code");
	const pixCodeInput = document.getElementById("pix-code");

	if (copyPixCodeBtn && pixCodeInput) {
		copyPixCodeBtn.addEventListener("click", async () => {
			// Select the text
			pixCodeInput.select();
			pixCodeInput.setSelectionRange(0, 99999); // For mobile devices

			try {
				await navigator.clipboard.writeText(pixCodeInput.value);
				// Create success message if it doesn't exist
				let successMsg = document.querySelector(".copy-success");
				if (!successMsg) {
					successMsg = document.createElement("div");
					successMsg.className = "copy-success";
					successMsg.textContent = "Código copiado!";
					document.querySelector(".pix-code-wrapper").appendChild(successMsg);
				}

				// Show success message
				successMsg.classList.add("show");

				// Hide after 2 seconds
				setTimeout(() => {
					successMsg.classList.remove("show");
				}, 2000);
			} catch (err) {
				console.error("Erro ao copiar texto: ", err);
				alert(
					"Não foi possível copiar automaticamente. Por favor, selecione e copie o código manualmente.",
				);
			}
		});
	}

	// Modal Close Buttons
	const closeModalBtns = document.querySelectorAll(".close-modal, .close-btn");
	for (const btn of closeModalBtns) {
		btn.addEventListener("click", function () {
			const modal = this.closest(".modal");
			if (modal) {
				modal.classList.remove("active");
			}
		});
	}

	// Close modal when clicking outside
	window.addEventListener("click", (e) => {
		if (e.target.classList.contains("modal")) {
			e.target.classList.remove("active");
		}
	});

	// Header scroll effect
	const header = document.querySelector(".header");
	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			header.classList.add("scrolled");
		} else {
			header.classList.remove("scrolled");
		}
	});

	// Animate elements on scroll
	const animateElements = document.querySelectorAll(".animate-on-scroll");

	function checkScroll() {
		const triggerBottom = window.innerHeight * 0.8;

		for (const element of animateElements) {
			const elementTop = element.getBoundingClientRect().top;

			if (elementTop < triggerBottom) {
				element.classList.add("visible");
			}
		}
	}

	window.addEventListener("scroll", checkScroll);
	checkScroll(); // Check on initial load
});

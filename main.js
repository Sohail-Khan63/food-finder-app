// Accessing HTML Elements
const searchFoodBox = document.querySelector("#searchBox");
const searchBtn = document.querySelector(".btn");
const foodImg = document.querySelector("#foodImg");
const foodName = document.querySelector(".food-name");
const loading = document.querySelector(".loading-container");
const foodSummary = document.querySelector(".summary");
const foodDishType = document.querySelector(".dishType");
const foodCuisines = document.querySelector(".cuisines");
const foodCookTime = document.querySelector(".cooktime");
const parentContainer = document.querySelector(".food-main");
const viewFoodDetails = document.querySelector(".viewDetails");
// Fetching Data From API
const getFoodDetail = async () => {
  const searchFood = searchFoodBox.value.trim();
  if (!searchFood) {
    alert("Search Food By Name Please!");
    return;
  }
  // Handle Loading Feature
  loading.style.display = "flex";
  parentContainer.style.display = "none";

  // API KEY & URL
  const API_KEY = "659f9634ee8b46e6a54d3bc398eeebbe";
  const URL = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    searchFood
  )}&number=1&addRecipeInformation=true&apiKey=${API_KEY}`;
  const response = await fetch(URL);
  const data = await response.json();
  // Remove Loading While Data is Fetch From URL
  loading.style.display = "none";
  parentContainer.style.display = "block";
  console.log(data);
  // API give us 50 Tokens Per day
  // Handle API Limits Errors (402)
  if (data.code === 402) {
    showMessage("API request limit reached.");
    return;
  }
  // Handle not found (404) or empty results
  if (data.code === 404 || !data.results || data.results.length === 0) {
    showMessage("Food Not Found");
    return;
  }
  // Remove any Old Error Messages
  removeMessage();
  // Show Food Details
  const result = data.results[0];
  viewFoodDetails.dataset.id = result.id;
  viewFoodDetails.style.display = "inline-block";
  foodImg.src = result.image;
  foodName.textContent = result.title;
  function cleanSummary(summary) {
    let text = summary.replace(/<[^>]*>/g, "");
    text = text.split(". ")[0] + ".";
    return text;
  }
  foodSummary.textContent = cleanSummary(result.summary);
  // Handling Cuisines, DishType and CookTime
  let BtnsContainer = document.querySelector(".food-btns");
  BtnsContainer.querySelectorAll(".cuisines").forEach((btn) => btn.remove());
  if (result.cuisines.length > 0) {
    result.cuisines.forEach((cuisine) => {
      let cuisineBtn = document.createElement("button");
      cuisineBtn.classList.add("cuisines");
      cuisineBtn.textContent = cuisine;
      BtnsContainer.appendChild(cuisineBtn);
    });
  } else {
    let noCuisineBtn = document.createElement("button");
    noCuisineBtn.classList.add("cuisines");
    noCuisineBtn.textContent = "No Cuisines";
    BtnsContainer.appendChild(noCuisineBtn);
  }
  foodCookTime.textContent = `${result.readyInMinutes} mins`;
  foodDishType.textContent = result.dishTypes[0] || "No Dish type";

  //  Add ViewDetail Feature
  viewFoodDetails.addEventListener("click", async () => {
    // Modal elements
    const modal = document.getElementById("recipeModal");
    const closeBtn = document.querySelector(".close-btn");
    const modalTitle = document.querySelector(".modal-title");
    const modalIngredients = document.querySelector(".modal-ingredients");
    const modalInstructions = document.querySelector(".modal-instructions");
    const modalLink = document.querySelector(".modal-link");

    // Close modal
    closeBtn.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    // Get food ID
    const foodId = viewFoodDetails.dataset.id;
    if (!foodId) return;

    const newAPI = `https://api.spoonacular.com/recipes/${foodId}/information?apiKey=${API_KEY}`;
    const resp = await fetch(newAPI);
    const detail = await resp.json();

    console.log(detail);

    // Set title
    modalTitle.textContent = detail.title;

    // Fill ingredients
    modalIngredients.innerHTML = "";
    detail.extendedIngredients.forEach((ing) => {
      const li = document.createElement("li");
      li.classList.add("ingreLi");
      li.textContent = `${ing.amount} ${ing.unit} ${ing.name}`;
      modalIngredients.appendChild(li);
    });

    // Fill instructions
    modalInstructions.innerHTML = "";
    if (detail.analyzedInstructions.length > 0) {
      detail.analyzedInstructions[0].steps.forEach((step) => {
        const li = document.createElement("li");
        li.classList.add("instLi");
        li.textContent = step.step;
        modalInstructions.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No instructions available.";
      modalInstructions.appendChild(li);
    }

    // Set full recipe link
    modalLink.href = detail.sourceUrl;

    // Show modal
    modal.style.display = "flex";
  });
};

// Show Error Message
const showMessage = (msg) => {
  // Hide details so only the message shows
  foodImg.style.display = "none";
  foodName.style.display = "none";
  foodSummary.style.display = "none";
  document.querySelector(".food-btns").style.display = "none";
  foodCookTime.style.display = "none";
  foodDishType.style.display = "none";
  viewFoodDetails.style.display = "none";

  // Show message
  let h1 = parentContainer.querySelector("h1");
  if (!h1) {
    h1 = document.createElement("h1");
    h1.style.color = "red";
    parentContainer.appendChild(h1);
  }
  h1.textContent = msg;
};
// Remove Error Message & Show Food Detalais
const removeMessage = () => {
  let h1 = parentContainer.querySelector("h1");
  if (h1) h1.remove();

  // show  Food Details Again
  foodImg.style.display = "";
  foodName.style.display = "";
  foodSummary.style.display = "";
  document.querySelector(".food-btns").style.display = "";
  foodCookTime.style.display = "";
  foodDishType.style.display = "";
  viewFoodDetails.style.display = "";
};
searchBtn.addEventListener("click", getFoodDetail);
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const singleMeal = document.getElementById("single-meal");

function searchMeal(e) {
  e.preventDefault();

  // Clear Single Meal
  singleMeal.innerHTML = "";

  // Get Search Term
  const term = search.value;

  // Check for empty input
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())

      .then((data) => {
        resultHeading.innerHTML = `<h2>Search results for ${term}:</h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>No items found.Please try again</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class='meal'>
                <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
                <div class='meal-info' data-mealID='${meal.idMeal}'>
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
            `
            )
            .join("");
        }
      });

    //   Clear search input
    search.value = "";
  } else {
    alert("Please enter some value");
  }
}

// Get meal by ID

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Fetch random meal from API
function randomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]} `
      );
    } else {
      break;
    }
  }
  singleMeal.innerHTML = `
  <div class='single-meal'>
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class='single-meal-info'>
    ${meal.strCategory ? `<p>Category:${meal.strCategory}</p>` : ""}
    ${meal.strArea ? `<p>Region:${meal.strArea}</p>` : ""}    
    ${
      meal.strYoutube
        ? `<a href='${meal.strYoutube}' target='_blank'>${meal.strYoutube}</a>`
        : ""
    }    
    </div>
    <div class='main'>
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        
        </ul>
    </div>
  </div>
  
  `;
}

// Event Listeners

submit.addEventListener("submit", searchMeal);

random.addEventListener("click", randomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});

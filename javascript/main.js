document.addEventListener('DOMContentLoaded', () => {
    class Drink {
        name;
        image;
        glass;
        category;
        alcoholic;
        ingredients = [];
        instructions;

        constructor(name, image, glass, category, alcoholic, ingredients, instructions) {
            this.name = name;
            this.image = image;
            this.glass = glass;
            this.category = category;
            this.alcoholic = alcoholic;
            this.ingredients = ingredients;
            this.instructions = instructions;
        }
    }

    const setSelectedDrink = drink => {
        const drinkImage = document.querySelector('#drinkImage');
        const drinkName = document.querySelector('#drinkName');
        const drinkCategory = document.querySelector('#drinkCategory');
        const drinkAlcoholic = document.querySelector('#drinkAlcoholic');
        const drinkGlass = document.querySelector('#drinkGlass');
        const drinkIngredients = document.querySelector('#drinkIngredients');
        const drinkInstructions = document.querySelector('#drinkInstructions');

        drinkName.textContent = drink.name;
        drinkImage.src = drink.image;
        drinkCategory.textContent = drink.category;
        drinkAlcoholic.textContent = drink.alcoholic;
        drinkGlass.textContent = drink.glass;
        drinkIngredients.innerHTML = '';
        drink.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = `${ingredient.measure} ${ingredient.ingredient}`;
            drinkIngredients.appendChild(li);
        });
        drinkInstructions.textContent = drink.instructions;

        const main = document.querySelector('main');
        main.scrollIntoView({ behavior: 'smooth' });
    };

    const getDrinks = async searchValue => {
        const drinksRow = document.querySelector('#drinksRow');
        const noDrinkWarning = document.querySelector('#noDrinkWarning');
        const errorWarning = document.querySelector('#errorWarning');

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchValue}`);
            if (!response.ok) {
                errorWarning.classList.remove('hidden');
                return;
            } else {
                errorWarning.classList.add('hidden');
            }

            const data = await response.json();
            if (data.drinks === null) {
                noDrinkWarning.classList.remove('hidden');
                return;
            } else {
                noDrinkWarning.classList.add('hidden');
            }
            drinksRow.innerHTML = '';
            data.drinks.forEach((drink, index) => {
                const ingredients = [];
                for (let i = 1; i <= 15; i++) {
                    let ingredient, measure;
                    if (drink[`strIngredient${i}`] !== null) {
                        ingredient = drink[`strIngredient${i}`];
                    } else {
                        break;
                    }
                    if (drink[`strMeasure${i}`] == null) {
                        measure = '';
                    } else {
                        measure = drink[`strMeasure${i}`];
                    }

                    ingredients.push({ ingredient, measure });
                }
                const newDrink = new Drink(drink.strDrink, drink.strDrinkThumb, drink.strGlass, drink.strCategory, drink.strAlcoholic, ingredients, drink.strInstructions);

                if (index == 0) {
                    setSelectedDrink(newDrink);
                }
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <img src="${drink.strDrinkThumb}" />
                    <div class="cardBody">
                        <h2 class="cardTitle">${drink.strDrink}</h2>
                        <ul class="list">
                            <li class="drinkCategory">${drink.strCategory}</li>
                            <li class="drinkAlcoholic">${drink.strAlcoholic}</li>
                        </ul>
                    </div>
                `;
                card.addEventListener('click', () => setSelectedDrink(newDrink));
                drinksRow.appendChild(card);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const searchInput = document.querySelector('#searchInput');
    const searchButton = document.querySelector('#searchButton');

    searchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    searchButton.addEventListener('click', () => getDrinks(searchInput.value));

    getDrinks('');
});

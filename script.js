document.getElementById("submit-btn").addEventListener("click",function(){
    const checkedItems = document.querySelectorAll(
        "#ingredient-form input[type='checkbox']:checked"
    );

    const ingredients = Array.from(checkedItems).map((item)=>item.value);

    console.log("선택된 재료:", ingredients);

    const container = document.getElementById("selected-ingredients");
    container.innerHTML = "";

    if(ingredients.length === 0){
        container.innerHTML="<p>선택된 재료가 없습니다.</p>";
    } else{
        ingredients.forEach((item)=>{
            const span = document.createElement("span");
            span.textContent = item;
            span.classList.add("selected-item");
            container.appendChild(span);
        });
    }
});

let RECIPES = [];

window.addEventListener("DOMContentLoaded", async function () {
    try{
        const res = await fetch("recipes.json");
        if(!res.ok) throw new Error("레시피 데이터를 불러오지 못했습니다.");
        RECIPES = await res.json();
        console.log("레시피 로드 완료:", RECIPES);
    } catch(err){
        console.error(err);
    }
})

document.getElementById("submit-btn").addEventListener("click", function(){
    const checkedItems = document.querySelectorAll(
        "#ingredient-form input[type='checkbox']:checked"
    );
    const selected = Array.from(checkedItems).map((item)=>item.value);
    console.log("선택된 재료:", selected);

    const chipContainer = document.getElementById("selected-ingredients");
    chipContainer.innerHTML = "";
    if(selected.length === 0){
        chipContainer.innerHTML = "<p>선택된 재료가 없습니다.</p>";
    } else{
        selected.forEach((name) =>{
            const span = document.createElement("span");
            span.textContent = name;
            span.classList.add("selected-item");
            chipContainer.appendChild(span);
        });
    }

    const selectedSet = new Set(selected);
    const filtered = RECIPES.filter((recipe)=>{
        const required = recipe.ingredients?.["필수"] ?? [];
        return required.every((req)=>selectedSet.has(req));
    });

    const list = document.getElementById("recipe-results");
    list.innerHTML = "";

    if (filtered.length === 0){
        const p = document.createElement("p");
        p.textContent = "조건에 맞는 레시피가 없습니다.";
        list.appendChild(p);
        return;
    }

    filtered.forEach((recipe) =>{
        const card = document.createElement("article");
        card.className = "recipe-card";
        
        const title = document.createElement("h3");
        title.className = "recipe-title";
        title.textContent = recipe.name;
        card.appendChild(title);

        const ingBlock = document.createElement("div");
        ingBlock.className = "recipe-ingredients";

        const req = recipe.ingredients?.["필수"]??[];
        req.forEach((name) => {
            const chip = document.createElement("span");
            chip.className = "ingredient-chip required";
            chip.textContent = name;
            ingBlock.appendChild(chip);
        });

        const opt = recipe.ingredients?.["선택"]??[];
        opt.forEach((name)=>{
            const chip = document.createElement("span");
            chip.className = "ingredient-chip";
            chip.textContent = name;
            ingBlock.appendChild(chip);
        });

        card.appendChild(ingBlock);

        const stepsList = document.createElement("ol");
        stepsList.className = "recipe-steps";
        recipe.steps.forEach((step) => {
            const li = document.createElement("li");
            li.textContent = step;
            stepsList.appendChild(li);
        });

        card.appendChild(stepsList);
        list.appendChild(card);
    });
});
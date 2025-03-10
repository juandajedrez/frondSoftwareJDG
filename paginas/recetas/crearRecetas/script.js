document.addEventListener('DOMContentLoaded', function() {
    const newRecipeForm = document.getElementById('newRecipeForm');

    newRecipeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const newRecipe = {
            name: newRecipeForm.name.value,
            ingredients: newRecipeForm.ingredients.value.split(', ').map(ing => {
                const [productId, details] = ing.split(' (');
                if (!details) return { productId, quantity: 0, unitOfMeasure: '', additionalNotes: '' };
                const [quantity, unitOfMeasure, ...additionalNotes] = details.replace(')', '').split(' ');
                return { productId, quantity: parseInt(quantity), unitOfMeasure, additionalNotes: additionalNotes.join(' ') || '' };
            }),
            instructions: newRecipeForm.instructions.value,
            preparationTime: parseInt(newRecipeForm.preparationTime.value),
            servings: parseInt(newRecipeForm.servings.value),
            comment: newRecipeForm.comment.value,
            creationDate: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            recipeStatus: "INACTIVE"
        };

        fetch('http://localhost:8080/api/recipes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecipe)
        })
        .then(response => response.json())
        .then(data => {
            alert('Receta creada con éxito');
            window.location.href = '../gestionRecetas.html'; // Redirigir a la página de gestión de recetas
        })
        .catch(error => {
            console.error('Error al crear la receta:', error);
            alert('Error al crear la receta. Por favor, inténtelo de nuevo más tarde.');
        });
    });
});
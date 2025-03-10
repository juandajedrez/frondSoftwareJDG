document.addEventListener('DOMContentLoaded', function() {
    const recipeDetail = document.getElementById('recipeDetail');
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        fetch(`https://backend-sofware-iii.onrender.com/api/recipes/${recipeId}`)
            .then(response => response.json())
            .then(recipe => {
                recipeDetail.innerHTML = `
                    <h3 contenteditable="false" id="recipeName">${recipe.name}</h3>
                    <p><span>Ingredientes:</span> <span contenteditable="false" id="recipeIngredients">${recipe.ingredients.map(ing => ing.productId ? `${ing.productId} (${ing.quantity} ${ing.unitOfMeasure}${ing.additionalNotes ? ` ${ing.additionalNotes}` : ''})` : 'N/A').join(', ')}</span></p>
                    <p><span>Instrucciones:</span> <span contenteditable="false" id="recipeInstructions">${recipe.instructions.replace(/\n/g, '<br>')}</span></p>
                    <p><span>Tiempo de preparación:</span> <span contenteditable="false" id="recipePreparationTime">${recipe.preparationTime} minutos</span></p>
                    <p><span>Porciones:</span> <span contenteditable="false" id="recipeServings">${recipe.servings}</span></p>
                    <p><span>Comentario:</span> <span contenteditable="false" id="recipeComment">${recipe.comment}</span></p>
                `;
            })
            .catch(error => {
                console.error('Error al cargar la receta:', error);
                recipeDetail.innerHTML = '<p>Error al cargar la receta. Por favor, inténtelo de nuevo más tarde.</p>';
            });
    } else {
        recipeDetail.innerHTML = '<p>ID de receta no proporcionado.</p>';
    }

    document.getElementById('editRecipe').addEventListener('click', function() {
        const editButton = document.getElementById('editRecipe');
        const isEditing = editButton.textContent === 'Actualizar';

        if (isEditing) {
            const updatedRecipe = {
                id: recipeId, 
                name: document.getElementById('recipeName').textContent,
                ingredients: document.getElementById('recipeIngredients').textContent.split(', ').map(ing => {
                    const [productId, details] = ing.split(' (');
                    if (!details) return { productId, quantity: 0, unitOfMeasure: '', additionalNotes: '' };
                    const [quantity, unitOfMeasure, ...additionalNotes] = details.replace(')', '').split(' ');
                    return { productId, quantity: parseInt(quantity), unitOfMeasure, additionalNotes: additionalNotes.join(' ') || '' };
                }),
                instructions: document.getElementById('recipeInstructions').innerHTML.replace(/<br>/g, '\n'),
                preparationTime: parseInt(document.getElementById('recipePreparationTime').textContent.split(' ')[0]),
                servings: parseInt(document.getElementById('recipeServings').textContent),
                comment: document.getElementById('recipeComment').textContent,
                creationDate: "2025-03-09", 
                recipeStatus: "INACTIVE" 
            };
            
            console.log('JSON enviado:', JSON.stringify(updatedRecipe)); // Mostrar el JSON en la consola

            fetch(`https://backend-sofware-iii.onrender.com/api/recipes/${recipeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRecipe)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                alert('Receta actualizada con éxito');
                editButton.textContent = 'Editar';
                toggleEditable(false);
            })
            .catch(error => {
                console.error('Error al actualizar la receta:', error);
                alert('Error al actualizar la receta');
            });
        } else {
            editButton.textContent = 'Actualizar';
            toggleEditable(true);
        }
    });

    document.getElementById('deleteRecipe').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
            fetch(`https://backend-sofware-iii.onrender.com/api/recipes/${recipeId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    alert('Receta eliminada con éxito');
                    window.location.href = '../gestionRecetas.html';
                } else {
                    alert('Error al eliminar la receta');
                }
            })
            .catch(error => {
                console.error('Error al eliminar la receta:', error);
                alert('Error al eliminar la receta');
            });
        }
    });

    document.getElementById('backButton').addEventListener('click', function() {
        window.location.href = '../gestionRecetas.html';
    });

    function toggleEditable(editable) {
        const elements = recipeDetail.querySelectorAll('[contenteditable]');
        elements.forEach(element => {
            element.contentEditable = editable;
            element.style.backgroundColor = editable ? '#e3f2fd' : '#f9f9f9';
        });
    }
});
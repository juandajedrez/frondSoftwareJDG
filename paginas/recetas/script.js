document.addEventListener('DOMContentLoaded', function() {
    const loadRecipesButton = document.getElementById('loadRecipes');
    const recipeList = document.getElementById('recipeList');

    loadRecipesButton.addEventListener('click', function() {
        recipeList.innerHTML = '<p>Cargando recetas...</p>'; // Indicador de carga

        fetch('http://localhost:8080/api/recipes')
            .then(response => response.json())
            .then(data => {
                recipeList.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tiempo de preparación</th>
                                <th>Porciones</th>
                                <th>Comentario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                `;
                const tbody = recipeList.querySelector('tbody');
                data.forEach(recipe => {
                    const recipeRow = document.createElement('tr');
                    recipeRow.innerHTML = `
                        <td>${recipe.name}</td>
                        <td>${recipe.preparationTime} minutos</td>
                        <td>${recipe.servings}</td>
                        <td>${recipe.comment}</td>
                        <td><button onclick="verReceta('${recipe.id}')">Ver Receta</button></td>
                    `;
                    tbody.appendChild(recipeRow);
                });
            })
            .catch(error => {
                console.error('Error al cargar las recetas:', error);
                recipeList.innerHTML = '<p>Error al cargar las recetas. Por favor, inténtelo de nuevo más tarde.</p>';
            });
    });
});

function verReceta(id) {
    window.location.href = `viewReceta/viewReceta.html?id=${id}`;
}
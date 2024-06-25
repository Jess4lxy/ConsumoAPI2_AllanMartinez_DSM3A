// To find a Pokemon, I requested the 'search' id and added an listener event
// to identify the enter key.
document.getElementById('search').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        // Later with that introduced Pokemon I convert it into lowercase 
        // to make it recognizable by the API using 'fetchPokemon'
        const query = event.target.value.toLowerCase();
        fetchPokemon(query);
    }
});

//With the query given by the 'search', I perfom a fetch into the JSON from the API to gather the Pokemon
function fetchPokemon(query) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        .then(response => response.json())
        .then(data => {
            displayPokemon(data);
        })
        //if the requested Pokemon is not found, an error code will be returned.
        .catch(error => {
            console.error('Error fetching Pokémon:', error);
            document.getElementById('pokemon-info').innerHTML = '<p>Pokémon not found. Please try again.</p>';
        });
}

// Finally, with the found pokemon inside the 'pokemon' section of the database, I'm going to gather all
// the information about the given pokemon.
function displayPokemon(pokemon) {
    const pokemonInfoDiv = document.getElementById('pokemon-info');
    // pokemon types gathering
    const types = pokemon.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join(' ');
    // all requested pokemon information
    pokemonInfoDiv.innerHTML = `
        <div class="title-bar">${pokemon.name}</div>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div class="info-section">
            <p>ID: ${pokemon.id.toString().padStart(7, '0')}</p>
            <p>Type: ${types}</p>
        </div>
        <div class="stats">
            <p>HT: ${(pokemon.height / 10).toFixed(2)} M</p>
            <p>WT: ${(pokemon.weight / 10).toFixed(2)} Kg</p>
        </div>
        <div class="description">
            <p>Loading description...</p>
        </div>
    `;
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
        .then(response => response.json())
        .then(data => {
            //language information selection
            const description = data.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
            pokemonInfoDiv.querySelector('.description').innerHTML = `<p>${description}</p>`;
        });
}
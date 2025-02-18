window.onload = async () => {
  const pokemons = await fetchPokemons();
  logFetchedPokemons(pokemons);
};

async function fetchPokemons(numberOfPokemons = 151) {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=" + numberOfPokemons
    );
    if (!response.ok) {
      handleFetchResponseError(response);
    }
    const data = await response.json();
    const pokemons = data.results;
    console.log(pokemons);
    return pokemons;
  } catch (error) {
    //Handle every error from the data fetching
    handleError(error);
  }
}

function handleError(error) {
  console.log(error);
  //TODO : return error page
}

function handleFetchResponseError(response) {
  console.log("Error fetching data" + response.status);
}

function logFetchedPokemons(pokemons) {
  const pokemonArray = pokemons.map((pokemon) => {
    return pokemon.name;
  });
  const sortedPokemonArray = pokemonArray.sort();
  sortedPokemonArray.map((pokemon) => {
    console.log(pokemon);
    console.log(pokemon.slice(0, 1).toUpperCase() + pokemon.slice(1));
  });
}

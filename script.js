window.onload = async () => {
  const list = await getPokemonListNames(151);
  console.log(list);
  const pokemonData = await getSpecificPokemon("ivysaur");
  console.log(pokemonData);
  const pokemonType = getPokemonTypes(pokemonData);
  console.log(pokemonType);
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
    console.log(data);
    const pokemons = data.results;
    return pokemons;
  } catch (error) {
    //Handle every error from the data fetching
    handleError(error);
  }
}

async function getPokemonListNames(numberOfPokemons) {
  const pokemonList = await fetchPokemons(numberOfPokemons);
  const pokemonArray = [];
  pokemonList.map((pokemon) => {
    pokemonArray.push(pokemon.name);
  });
  pokemonArray.sort();
  return pokemonArray;
}

function handleError(error) {
  console.log(error);
  //TODO : return error page
}

function handleFetchResponseError(response) {
  console.log("Error fetching data" + response.status);
}

async function getSpecificPokemon(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    if (!response.ok) {
      handleFetchResponseError(response);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleError(error);
  }
}

function getPokemonTypes(pokemonData) {
  return pokemonData.types;
}

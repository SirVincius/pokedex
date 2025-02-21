const POKEMON_TEST = "bulbasaur";

window.onload = async () => {
  const list = await getPokemonListNames(151);
  const pokemonData = await getSpecificPokemon(POKEMON_TEST);
  const pokemonSpecies = await getSpecie(pokemonData);
  const pokemonEvolutionChain = await getEvolutionChain(pokemonData);
  const evolutionChain = await getNextEvolutions(pokemonData);
  console.log(evolutionChain);
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      handleFetchResponseError(response);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleError(error);
  }
}

async function fetchPokemons(numberOfPokemons = 151) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${numberOfPokemons}`;
  const data = await fetchData(url);
  return data.results;
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
  //console.log(error);
  //TODO : return error page
}

function handleFetchResponseError(response) {
  //console.log("Error fetching data" + response.status);
}

async function getSpecificPokemon(pokemonName) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const data = await fetchData(url);
  return data;
}

function getPokemonTypes(pokemonData) {
  return pokemonData.types;
}

async function getSpecie(pokemonData) {
  const speciesUrl = pokemonData.species.url;
  console.log(speciesUrl);
  const speciesData = await fetchData(speciesUrl);
  return speciesData;
}

async function getEvolutionChain(pokemonData) {
  const speciesData = await getSpecie(pokemonData);
  const ecolutionChainURL = speciesData.evolution_chain.url;
  const evolutionChainData = await fetchData(ecolutionChainURL);
  return evolutionChainData.chain;
}

async function getNextEvolutions(pokemonData, evolutionsFound = []) {
  const pokemonEvolutionChain = await getEvolutionChain(pokemonData);

  //Recursive function to visit every evolutions
  async function visitChain(chain) {
    if (chain.evolves_to.length === 0) {
      return;
    }

    for (const evolution of chain.evolves_to) {
      const evolutionName = evolution.species.name;

      if (!evolutionsFound.includes(evolutionName)) {
        evolutionsFound.push(evolutionName);
        await visitChain(evolution);
      }
    }
  }

  await visitChain(pokemonEvolutionChain);

  return evolutionsFound;
}

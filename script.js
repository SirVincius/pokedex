window.onload = async () => {
  console.log("Script loaded!"); //To remove
  const allPokemons = await fetchAllPokemons(150);
  const allPokemonsArray = getAllPokemonsAsArray(allPokemons);
  console.log(allPokemonsArray);
  const pokemonInfos = await getPokemonInfos("1");
  console.log(pokemonInfos);
  console.log("Name : " + getPokemonName(pokemonInfos));
  console.log("ID : " + getPokemonId(pokemonInfos));
  console.log("Types : " + getPokemonTypes(pokemonInfos));
  console.log("Main type : " + getPokemonMainType(pokemonInfos));
  console.log("Height in meters : " + getPokemonHeightInMeters(pokemonInfos));
  console.log("Weight in meters : " + getPokemonWeightInKg(pokemonInfos));
  console.log("Base stats : " + getPokemonBaseStats(pokemonInfos));
};

async function fetchAllPokemons(numberOfPokemons) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${numberOfPokemons}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching pokemons : ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error handling pokemon fetching, ${err.message}`);
    throw err;
  }
}

function getAllPokemonsAsArray(allPokemonsObject) {
  let allPokemonsArray = [];
  allPokemonsObject.results.forEach((pokemon) => {
    allPokemonsArray.push(pokemon.name);
  });
  allPokemonsArray.sort();
  return allPokemonsArray;
}

async function getPokemonInfos(pokemonNameOrId) {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/" + pokemonNameOrId
    );
    if (!response.ok) {
      throw new Error("Error fecthing pokemon infos : " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`Error fetching pokemon ${pokemonNameOrId}, ${err.message}`);
    throw err;
  }
}

function getPokemonName(pokemonInfos) {
  const pokemonName = pokemonInfos.name;
  return pokemonName;
}

function getPokemonId(pokemonInfos) {
  const pokemonId = pokemonInfos.id;
  return pokemonId;
}

function getPokemonTypes(pokemonInfos) {
  let pokemonTypes = [];
  pokemonInfos.types.forEach((type) => {
    pokemonTypes.push(type.type.name);
  });
  return pokemonTypes;
}

function getPokemonMainType(pokemonInfos) {
  const pokemonMainType = pokemonInfos.types[0].type.name;
  return pokemonMainType;
}

function getPokemonHeightInMeters(pokemonInfos) {
  const height = pokemonInfos.height / 10;
  return height;
}

function getPokemonWeightInKg(pokemonInfos) {
  const pokemonWeight = pokemonInfos.weight / 100;
  return pokemonWeight;
}

/**
 * Return an array containing the following values [hp, attack, defense, special-attack, special-defense, speed]
 */
function getPokemonBaseStats(pokemonInfos) {
  let pokemonBaseStats = [];
  pokemonInfos.stats.forEach((stat) => {
    pokemonBaseStats.push(stat.base_stat);
  });
  return pokemonBaseStats;
}

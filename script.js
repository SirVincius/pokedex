const POKEMON_TEST = "bulbasaur";
var POKEMON_STATS_SUM;
var NUMBER_OF_POKEMONS = 151;

window.onload = async () => {
  buildPokemonList();
  activatePokemonSelect();
  POKEMON_STATS_SUM = await getPokemonAverageStats(POKEMON_STATS_SUM);
  console.log(POKEMON_STATS_SUM);
};

/**
 * Activate the main event listener on pokemon select
 */
function activatePokemonSelect() {
  var pokemonSelect = document.getElementById("pokemon-select");

  pokemonSelect.addEventListener("change", async () => {
    var pokemonSelectValue = document.getElementById("pokemon-select").value;
    const pokemonData = await getSpecificPokemon(pokemonSelectValue);
    printData("Pokemon data", pokemonData);
    const pokemonSpecies = await getSpecie(pokemonData);
    const pokemonEvolutionChain = await getEvolutionChain(pokemonData);
    const evolutionChain = await getAllEvolutions(pokemonData);
    const pokemonImage = getPokemonImage(pokemonData);
    printPokemonInfos(pokemonData);
    const pokemonEvolutionsImages = await getPokemonEvolutionsImages(
      pokemonData
    );
    printPokemonEvolutionsImages(pokemonData, pokemonEvolutionsImages);
  });
}

/**
 * Generic function to fetch data with error handling
 */
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

/**
 * Fetch the data for pokemons number 1 to numberOfPokemons
 */
async function fetchPokemons(numberOfPokemons = NUMBER_OF_POKEMONS) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${numberOfPokemons}`;
  const data = await fetchData(url);
  return data.results;
}

async function getPokemonAverageStats(numberOfPokemons = NUMBER_OF_POKEMONS) {
  const pokemons = await fetchPokemons(numberOfPokemons);
  const statsSum = {};
  for (const pokemon of pokemons) {
    const pokemonData = await getSpecificPokemon(pokemon.name);
    Object.keys(pokemonData.stats).forEach((key) => {
      if (!statsSum[pokemonData.stats[key].stat.name]) {
        statsSum[pokemonData.stats[key].stat.name] = 0;
      }
      statsSum[pokemonData.stats[key].stat.name] += Number(
        pokemonData.stats[key].base_stat
      );
    });
  }
  Object.keys(statsSum).forEach((key) => {
    statsSum[key] = (statsSum[key] / 151).toFixed(2);
  });
  return statsSum;
}

/**
 * Error handling function, logs the error and return an error page
 */
function handleError(error) {
  //console.log(error);
  //TODO : return error page
}

/**
 * Error handling function for fetch, logs the error and return an error page
 */
function handleFetchResponseError(response) {
  //console.log("Error fetching data" + response.status);
}

/**
 * Return a an array with the name of the pokemons from 1 to numberOfPokemons
 */
async function getPokemonListNames(numberOfPokemons) {
  const pokemonList = await fetchPokemons(numberOfPokemons);
  const pokemonArray = [];
  pokemonList.map((pokemon) => {
    pokemonArray.push(pokemon.name);
  });
  pokemonArray.sort();
  return pokemonArray;
}

/**
 * Fill the select pokemon html element with every pokemon from the array of fetched pokemons
 */
async function buildPokemonList() {
  const pokemonList = await getPokemonListNames();
  const selectElement = document.getElementById("pokemon-select");
  selectElement.innerHTML = "";
  pokemonList.forEach((pokemon) => {
    let _option = document.createElement("option");
    _option.value = pokemon;
    _option.text = capitalizeFirstletter(pokemon);
    selectElement.appendChild(_option);
  });
}

/**
 * Return informations for a given pokemon
 */
async function getSpecificPokemon(pokemonName) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const data = await fetchData(url);
  return data;
}

/**
 * Return additionnal information for a given pokemon
 */
async function getSpecie(pokemonData) {
  const speciesUrl = pokemonData.species.url;
  const speciesData = await fetchData(speciesUrl);
  return speciesData;
}

/**
 * Get the evolution chain of a pokemon (an object describing the different forma a pokemon can take)
 */
async function getEvolutionChain(pokemonData) {
  const speciesData = await getSpecie(pokemonData);
  const ecolutionChainURL = speciesData.evolution_chain.url;
  const evolutionChainData = await fetchData(ecolutionChainURL);
  return evolutionChainData.chain;
}

/**
 * Return an array filled with the name of every pokemon from his evolution chain
 */
async function getAllEvolutions(pokemonData, evolutionsFound = []) {
  const pokemonEvolutionChain = await getEvolutionChain(pokemonData);

  evolutionsFound.push(pokemonEvolutionChain.species.name);

  //Recursive function to visit every evolutions
  async function visitChain(chain) {
    if (chain.evolves_to.length === 0) {
      return evolutionsFound;
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

function getPokemonTypes(pokemonData) {
  const pokemonTypes = [];
  pokemonData.types.forEach((type) => {
    pokemonTypes.push(type.type.name);
  });
  return pokemonTypes;
}

function getPokemonImage(pokemonData) {
  return pokemonData.sprites.other["official-artwork"]["front_default"];
}

async function getPokemonEvolutionsImages(pokemonData) {
  const evolutionsImagesArray = [];
  const evolutions = await getAllEvolutions(pokemonData);
  for (const evolution of evolutions) {
    const specificPokemonData = await getSpecificPokemon(evolution);
    evolutionsImagesArray.push(getPokemonImage(specificPokemonData));
  }
  return evolutionsImagesArray;
}

function printPokemonEvolutionsImages(pokemonData, evolutions) {
  const pokemonEvolutionsElement =
    document.getElementById("pokemon-evolutions");
  pokemonEvolutionsElement.innerHTML = "";
  console.log(evolutions);
  evolutions.forEach((evolution) => {
    console.log(
      `${evolution} === ${pokemonData.sprites.other["official-artwork"]["front_default"]}`
    );
    if (
      !(
        evolution ===
        pokemonData.sprites.other["official-artwork"]["front_default"]
      )
    ) {
      pokemonEvolutionsElement.innerHTML += `<a href="${evolution}"><img class"pokemon-evolution-image" src="${evolution}" alt="" /></a>`;
    } else {
      pokemonEvolutionsElement.innerHTML += `<a href="${evolution}"><img class"pokemon-evolution-image" style="border-bottom: 1px solid black" src="${evolution}" alt="" /></a>`;
    }
  });
}

function printPokemonImage(pokemonData) {
  const pokemonImageURL = getPokemonImage(pokemonData);
  var pokemonImageElement = document.getElementById("pokemon-image");
  pokemonImageElement.src = pokemonImageURL;
}

function printData(message, data) {
  const formattedMessage = `------------------------------${message}------------------------------`;
  console.log(formattedMessage);
  console.log(data);
  console.log("-".repeat(formattedMessage.length));
}

function capitalizeFirstletter(_string) {
  return _string.charAt(0).toUpperCase() + _string.slice(1, _string.length);
}

function getPokemonId(pokemonData) {
  return pokemonData.id;
}

function printPokemonId(pokemonData) {
  document.getElementById("pokemon-id").innerHTML = `No : ${getPokemonId(
    pokemonData
  )}`;
}

function getPokemonName(pokemonData) {
  return capitalizeFirstletter(pokemonData.name);
}

function printPokemonName(pokemonData) {
  document.getElementById("pokemon-name").innerHTML =
    getPokemonName(pokemonData);
}

function printPokemonInfos(pokemonData) {
  printPokemonId(pokemonData);
  printPokemonName(pokemonData);
  printPokemonTypes(pokemonData);
  printPokemonImage(pokemonData);
  printPokemonEvolutions(pokemonData);
  printPokemonHeight(pokemonData);
  printPokemonWeight(pokemonData);
  printPokemonStats(pokemonData);
}

function getPokemonMainType(pokemonData) {
  return getPokemonTypes(pokemonData)[0].type.name;
}

function printPokemonTypes(pokemonData) {
  const pokemonTypes = getPokemonTypes(pokemonData);
  const pokemonTypesElement = document.getElementById("pokemon-types");
  pokemonTypesElement.innerHTML = "";
  pokemonTypes.forEach((type) => {
    let typeHTML = document.createElement("p");
    typeHTML.className = `type-label ${type}-type-color`;
    typeHTML.textContent = type;
    pokemonTypesElement.appendChild(typeHTML);
  });
}

async function printPokemonEvolutions(pokemonData) {
  const pokemonEvolutions = await getAllEvolutions(pokemonData);
  let pokemonEvolutionsElement = document.getElementById("pokemon-evolutions");
  pokemonEvolutionsElement.innerHTML = "";
  pokemonEvolutions.forEach((evolution) => {
    pokemonEvolutionsElement.innerHTML += `${capitalizeFirstletter(
      evolution
    )} `;
  });
}

function getPokemonHeight(pokemonData) {
  return pokemonData.height;
}

function printPokemonWeight(pokemonData) {
  const pokemonWeight = getPokemonWeight(pokemonData);
  const pokemonWeightInMeters = (pokemonWeight / 10).toFixed(2);
  document.getElementById(
    "pokemon-weight"
  ).innerHTML = `<strong>Weight : </strong>${pokemonWeightInMeters}kg`;
}

function getPokemonWeight(pokemonData) {
  return pokemonData.weight;
}

function printPokemonHeight(pokemonData) {
  const pokemonHeight = getPokemonHeight(pokemonData);
  const pokemonHeightInMeters = (pokemonHeight * 0.1).toFixed(1);
  document.getElementById(
    "pokemon-height"
  ).innerHTML = `<strong>Height : </strong>${pokemonHeightInMeters}m`;
}

function getPokemonStats(pokemonData) {
  const pokemonStats = {};
  pokemonData.stats.forEach((stat) => {
    const statName = stat.stat.name;
    const statValue = stat.base_stat;
    pokemonStats[statName] = statValue;
  });
  return pokemonStats;
}

function printPokemonStats(pokemonData) {
  const pokemonStatsElement = document.getElementById("pokemon-stats");
  pokemonStatsElement.innerHTML = "";
  const pokemonStats = getPokemonStats(pokemonData);
  Object.keys(pokemonStats).forEach((key) => {
    const capitalizedKey = capitalizeFirstletter(key);
    pokemonStatsElement.innerHTML += `<p id"pokemon-${key}"><strong>${capitalizedKey} : </strong>${pokemonStats[key]}</p>`;
  });
}

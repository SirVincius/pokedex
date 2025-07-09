window.onload = async () => {
  console.log("Script loaded!"); //To remove
  const allPokemons = await fetchAllPokemons(150);
  const allPokemonsArray = getAllPokemonsAsArray(allPokemons);
  console.log(allPokemonsArray);
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

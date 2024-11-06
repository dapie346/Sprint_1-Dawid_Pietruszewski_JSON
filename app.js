let currentPage = 1;
const itemsPerPage = 5;
let allCharacters = [];
const apiUrl = "http://localhost:3000/characters";

async function loadCharacters() {
  const name = document.getElementById("search-name").value.toLowerCase();
  const status = document.querySelector('input[name="status"]:checked').value;
  let url = `${apiUrl}?status=${status}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    allCharacters = await response.json();

    if (name) {
      allCharacters = allCharacters.filter((character) =>
        character.name.toLowerCase().includes(name)
      );
    }

    displayCharacters();
    updatePagination();
  } catch (error) {
    console.error(error);
    document.getElementById("character-container").innerHTML =
      "Nie znaleziono postaci spełniających kryteria wyszukiwania.";
  }
}

function searchCharacters() {
  currentPage = 1;
  loadCharacters();
}

function displayCharacters() {
  const container = document.getElementById("character-container");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const charactersToShow = allCharacters.slice(startIndex, endIndex);

  charactersToShow.forEach((character) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("character-card");
    characterCard.innerHTML = `
        <img src="${character.image}" alt="${character.name}">
        <h2>${character.name}</h2>
        <p>Status: ${character.status}</p>
        <p>Gatunek: ${character.species}</p>
      `;
    container.appendChild(characterCard);
  });
}

function updatePagination() {
  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  const totalPages = Math.ceil(allCharacters.length / itemsPerPage);
  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayCharacters();
    updatePagination();
  }
}

function nextPage() {
  currentPage++;
  displayCharacters();
  updatePagination();
}

async function createCharacter() {
  const name = document.getElementById("character-name").value;
  const status = document.getElementById("character-status").value;
  const species = document.getElementById("character-species").value;

  if (!name || !status || !species) {
    alert("Proszę wypełnić wszystkie pola formularza.");
    return;
  }

  const newCharacter = {
    name: name,
    status: status,
    species: species,
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharacter),
    });

    if (!response.ok) {
      throw new Error("Failed to create character");
    }

    alert("Postać została dodana pomyślnie!");
    loadCharacters();
  } catch (error) {
    console.error(error);
    alert("Wystąpił błąd podczas dodawania postaci.");
  }
}

document.addEventListener("DOMContentLoaded", loadCharacters);

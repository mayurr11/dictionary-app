// Selecting DOM elements
const searchBtn = document.querySelector(".search-btn");
const outputWord = document.querySelector(".searched-text");
const speech = document.querySelector(".speech");
const sound = document.querySelector("#sound");
const partOfSpeech = document.querySelector(".part-of-speech");
const searchResult = document.querySelector(".search-result");
const example = document.querySelector(".example");
const warning = document.querySelector(".warning");

// API URL for fetching dictionary data
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Event listener for search button
searchBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  const inputText = document.querySelector("#search-text");
  const searchText = inputText.value;

  try {
    // Fetch data from the API based on the search text
    const res = await fetch(API_URL + searchText);
    const data = await res.json();

    // Extract relevant information from the API response
    let meaning = data[0].meanings[0].definitions[0].definition;
    let noun = data[0].meanings[0].partOfSpeech;
    let exampleLine = data[0].meanings[0].definitions[0].example;
    let resultWord = data[0].word;

    // Update DOM elements with the retrieved data
    outputWord.textContent =
      resultWord.charAt(0).toUpperCase() + resultWord.slice(1);
    partOfSpeech.textContent = noun;
    searchResult.textContent = meaning;
    example.textContent = exampleLine;

    // Find and set audio data if available
    let voiceData = "";
    for (let i = 0; i < data[0].phonetics.length; i++) {
      if (data[0].phonetics[i].audio !== "") {
        voiceData = data[0].phonetics[i].audio;
        break; // Stop searching once non-empty audio data is found
      }
    }

    // Display speech button if audio data is available, otherwise show a warning
    if (voiceData !== "") {
      speech.style.display = "block";
      warning.style.display = "none";
      sound.setAttribute("src", voiceData);
    } else {
      speech.style.display = "none";
      warning.textContent = "Audio data is not available";
      // console.error("Audio data is missing in the API response.");
      // Handle the missing audio data, e.g., by displaying an error message or fallback content.
    }
  } catch (e) {
    // Handle errors in fetching data from the API
    const res = await fetch(API_URL + searchText);
    const data = await res.json();

    outputWord.textContent = data.title;
    partOfSpeech.style.display = "none";
    speech.style.display = "none";
    searchResult.textContent = data.message;
    example.textContent = data.resolution;
  }
});

// Function to play audio when speech button is clicked
const play = () => {
  sound.play();
};

// Event listener for speech button
speech.addEventListener("click", play);

async function handleFile() {
  const input = document.getElementById('fileInput');
  const output = document.getElementById('output');
  const meaningOutput = document.getElementById('meaningOutput');
  const loader = document.getElementById('loader');

  if (!input.files.length) {
    alert("Please upload a file");
    return;
  }

  const file = input.files[0];

  loader.style.display = 'block';
  output.textContent = '';
  meaningOutput.textContent = '';

  const imageUrl = URL.createObjectURL(file);

  try {
    const result = await Tesseract.recognize(
      imageUrl,
      'urd',
      {
        logger: m => console.log(m)
      }
    );

    const urduText = result.data.text;

    // Simulate API call to convert to Devanagari and fetch meanings
    const devanagariText = await fakeTransliterateAPI(urduText);
    output.textContent = devanagariText;

    const meanings = await fakeGetMeaningsAPI(urduText);
    meaningOutput.innerHTML = meanings.map(m => `<p>${m.word}: ${m.meaning}</p>`).join("");

  } catch (err) {
    output.textContent = "Error processing file: " + err.message;
  } finally {
    loader.style.display = 'none';
  }
}

// Simulated Transliteration API
async function fakeTransliterateAPI(text) {
  // Replace this with actual API call to backend
  return "देवनागरी ट्रांसक्रिप्शन: " + text.slice(0, 200) + "...";
}

// Simulated Dictionary API
async function fakeGetMeaningsAPI(text) {
  // You can extract rare words and send them to a dictionary API
  return [
    { word: "محبت", meaning: "Love" },
    { word: "زندگی", meaning: "Life" }
  ];
}

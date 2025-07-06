// script.js

// Handles file upload and runs OCR + transliteration
async function handleFile() {
  const input = document.getElementById('fileInput');
  const output = document.getElementById('output');
  const loader = document.getElementById('loader');

  if (!input.files.length) {
    alert("Please upload a file");
    return;
  }

  const file = input.files[0];

  loader.style.display = 'block';
  output.textContent = '';

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
    const devanagariText = await transliterateAPI(urduText);

    output.textContent = devanagariText;
  } catch (err) {
    output.textContent = "Error processing file: " + err.message;
  } finally {
    loader.style.display = 'none';
  }
}

// Sends text to Devnagri API
async function transliterateAPI(urduText) {
  const response = await fetch(
    "https://api.devnagri.com/v1/transliterate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer devnagri_637413045a2411f0be8642010aa00fc7"
      },
      body: JSON.stringify({
        text: urduText,
        source_lang: "ur",
        target_lang: "hi"
      })
    }
  );

  const data = await response.json();
  return data.transliteration || "No transliteration returned.";
}

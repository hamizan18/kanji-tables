import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  // State untuk input kanji disini
  const [kanjiInput, setKanjiInput] = useState('');
  const [hiraganaInput, setHiraganaInput] = useState('');
  const [katakanaInput, setKatakanaInput] = useState('');
  const [romajiInput, setRomajiInput] = useState('');

  // State untuk list kanji dari Supabase
  const [kanjiList, setKanjiList] = useState([]);
  
  // State untuk status app
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Ambil data kanji dari Supabase
  // async function getKanji() {
  //   const { data, error } = await supabase
  //     .from('n5_kanji')
  //     .select('id, kanji, hiragana, katakana, romaji')
  //     .order('id', { ascending: true });
    
  //   if (error) {
  //     setError(error.message);
  //   } else {
  //     setError('');
  //     setKanjiList(data ?? []);
  //   }

  //   setLoading(false);
  // }

  // Debug mode
  
async function getKanji() {
  const { data, error } = await supabase
    .from("n5_kanji")
    .select("id, kanji")
    .order("id", { ascending: true });

  console.log("Data dari Supabase:", data);
  console.log("Error dari Supabase:", error);

  if (error) {
    setError(error.message);
  } else {
    setError("");
    setKanjiList(data ?? []);
  }

  setLoading(false);
}

  useEffect(() => {
    getKanji();
  }, []);

  // Menambahkan kanji ke Supabase
  async function handleInsert(event) {
    event.preventDefault();

    if (!kanjiInput.trim()) {
      setMessage("Isi kanji terlebih dahulu!");
      return;
    }

    setMessage("");
    setError("");

    const { error } = await supabase
      .from('n5_kanji')
      .insert({
        kanji: kanjiInput.trim(),
        hiragana: hiraganaInput.trim(),
        katakana: katakanaInput.trim(),
        romaji: romajiInput.trim(),
      });

    if (error) {
      setMessage('Gagal menambahkan data: ' + error.message);
      return;
    }

    setMessage("Kanji berhasil ditambahkan!");
    setKanjiInput('');
    setHiraganaInput('');
    setKatakanaInput('');
    setRomajiInput('');

    // Refresh after insert
    await getKanji();
  }

  return (
    <main
      style={{
        padding: "32px",
        fontFamily: "sans-serif",
      }}
      >
        <h1>Hafaled Kanji</h1>
        <h2>JLPT N5</h2>

        <form onSubmit={handleInsert}>
          <input 
            type="text" 
            placeholder="Kanji"
            value={kanjiInput}
            onChange={(event) => 
              setKanjiInput(event.target.value)}
          />

          <input
            type="text"
            placeholder="Hiragana"
            value={hiraganaInput}
            onChange={(event) => setHiraganaInput(event.target.value)}
          />

          <input
            type="text"
            placeholder="Katakana"
            value={katakanaInput}
            onChange={(event) => setKatakanaInput(event.target.value)}
          />

          <input 
            type="text" 
            placeholder="Romaji"
            value={romajiInput}
            onChange={(event) => setRomajiInput(event.target.value)}
          />

          <button type="submit">
            Tambah
          </button>
        </form>

        {message && <p>{message}</p>}

        <hr />

        <h2>list kanji</h2>

        {loading && <p>Memuat data..</p>}

        {error && <p>Error: {error}</p>}

        {!loading && !error && (
          kanjiList.length > 0 ? (
            <ol>
              {kanjiList.map((item) => (
                <li key={item.id}>
                  {item.kanji}
                </li>
                ))}
            </ol>
        ) : (
          <p>Belum ada data kanji.</p>
        )
      )}
    </main>
  );
}

export default App
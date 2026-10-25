
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import "./App.css";

function App() {
  // State untuk form input
  const [kanjiInput, setKanjiInput] = useState("");
  const [hiraganaInput, setHiraganaInput] = useState("");
  const [katakanaInput, setKatakanaInput] = useState("");
  const [romajiInput, setRomajiInput] = useState("");
  const [showReadings, setShowReadings] = useState(false);

  // State untuk data dari Supabase
  const [kanjiList, setKanjiList] = useState([]);

  // State untuk status aplikasi
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Mengambil data kanji dari Supabase
  async function getKanji() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("n5_kanji")
      .select("id, kanji, hiragana, katakana, romaji")
      .order("id", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setKanjiList(data ?? []);
    }

    setLoading(false);
  }

  // Ambil data ketika halaman pertama kali dibuka
  useEffect(() => {
    getKanji();
  }, []);

  // Menambahkan kanji ke Supabase
  async function handleInsert(event) {
    event.preventDefault();

    if (!kanjiInput.trim() || !hiraganaInput.trim()) {
      setError("");
      setMessage("Kanji dan hiragana wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const { error } = await supabase.from("n5_kanji").insert({
      kanji: kanjiInput.trim(),
      hiragana: hiraganaInput.trim(),
      katakana: katakanaInput.trim() || null,
      romaji: romajiInput.trim() || null,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Kanji berhasil ditambahkan!");

      setKanjiInput("");
      setHiraganaInput("");
      setKatakanaInput("");
      setRomajiInput("");

      await getKanji();
    }

    setSaving(false);
  }

  return (
    <main className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-icon" aria-hidden="true">
          漢
        </div>

        <div className="header-text">
          <p className="eyebrow">JAPANESE LEARNING</p>
          <h1>Hafaled Kanji</h1>
          <p className="header-description">
            Bangun kosakata Jepangmu, satu kanji setiap hari.
          </p>
        </div>

        <span className="level-badge">JLPT N5</span>
      </header>

      {/* Form tambah kanji */}
      <section className="panel form-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR COLLECTION</p>
            <h2>Tambah kanji baru</h2>
          </div>

          <span className="heading-icon" aria-hidden="true">
            +
          </span>
        </div>

        <p className="section-description">
          Masukkan kanji beserta cara baca dan romajinya.
        </p>

        <form onSubmit={handleInsert} className="kanji-form">
          <div className="form-field">
            <label htmlFor="kanji">Kanji</label>
            <input
              id="kanji"
              type="text"
              placeholder="先生"
              value={kanjiInput}
              onChange={(event) => setKanjiInput(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="hiragana">Hiragana</label>
            <input
              id="hiragana"
              type="text"
              placeholder="せんせい"
              value={hiraganaInput}
              onChange={(event) => setHiraganaInput(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="katakana">
              Katakana <span className="optional">(opsional)</span>
            </label>
            <input
              id="katakana"
              type="text"
              placeholder="センセイ"
              value={katakanaInput}
              onChange={(event) => setKatakanaInput(event.target.value)}
              maxLength={100}
            />
          </div>

          <div className="form-field">
            <label htmlFor="romaji">
              Romaji <span className="optional">(opsional)</span>
            </label>
            <input
              id="romaji"
              type="text"
              placeholder="sensei"
              value={romajiInput}
              onChange={(event) => setRomajiInput(event.target.value)}
              maxLength={100}
            />
          </div>

          <button
            className="add-button"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              "Menyimpan..."
            ) : (
              <>
                <span aria-hidden="true">+</span>
                Tambah Kanji
              </>
            )}
          </button>
        </form>

        {message && (
          <p className="status-message success" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="status-message error" role="alert">
            Gagal: {error}
          </p>
        )}
      </section>

      {/* Daftar kanji */}
      <section className="panel list-panel">

      <div className="section-heading list-heading">
        <div>
          <p className="eyebrow">YOUR PROGRESS</p>
          <h2>Daftar kanji</h2>
        </div>

        <div className="list-actions">
          <button
            type="button"
            className="toggle-readings"
            onClick={() => setShowReadings((previous) => !previous)}
            aria-pressed={showReadings}
          >
            {showReadings ? "Hide 読み" : "Show 読み"}
          </button>

          <span className="count-badge">
            {kanjiList.length} kanji
          </span>
        </div>
      </div>

        <p className="section-description">
          Semua kanji yang tersimpan di koleksimu.
        </p>

        {loading ? (
          <div className="empty-state">
            <span className="loading-spinner" />
            <p>Memuat data kanji...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>Data belum bisa ditampilkan. Periksa koneksi Supabase.</p>
            <button
              type="button"
              className="secondary-button"
              onClick={getKanji}
            >
              Coba lagi
            </button>
          </div>
        ) : kanjiList.length === 0 ? (
          <div className="empty-state">
            <span className="empty-kanji" aria-hidden="true">
              あ
            </span>
            <h3>Belum ada kanji</h3>
            <p>Tambahkan kanji pertamamu melalui formulir di atas.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="kanji-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Kanji</th>
                  <th>Hiragana</th>
                  <th>Katakana</th>
                  <th>Romaji</th>
                </tr>
              </thead>

              <tbody>
                {kanjiList.map((item, index) => (
                  <tr key={item.id}>
                    <td className="number-cell">
                      {index + 1}
                    </td>
                    <td className="kanji-cell">
                      {item.kanji}
                    </td>
                    <td className="japanese-cell">
                      {showReadings ? (item.hiragana || "-") : "••••••"}
                    </td>
                    <td className="japanese-cell">
                      {showReadings ? (item.katakana || "-") : "••••••"}
                    </td>
                    <td className="romaji-cell">
                      {showReadings ? (item.romaji || "-") : "••••••"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && kanjiList.length > 0 && (
          <p className="table-footer">
            Menampilkan {kanjiList.length} data kanji.
            <span> Geser tabel ke samping jika diperlukan.</span>
          </p>
        )}
      </section>

      <footer className="app-footer">
        <p>Hafaled Kanji · Belajar sedikit demi sedikit.</p>
      </footer>
    </main>
  );
}

export default App;

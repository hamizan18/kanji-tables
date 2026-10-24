import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [instruments, setInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function getInstruments() {
      const { data, error } = await supabase
        .from('instruments')
        .select('id, name')
        .order('id')

      if (error) {
        setError(error.message)
      } else {
        setInstruments(data ?? [])
      }

      setLoading(false)
    }

    getInstruments()
  }, [])

  return (
    <main style={{ padding: '32px', fontFamily: 'sans-serif'}}>
      <h1>First Webss</h1>
      <h2>Daftar alat muzikk</h2>

      {loading && <p>Memuat data..</p>}

      {error && <p>Error: {error}.</p>}

      {!loading && !error && (
        <ol>
          {instruments.map((instruments) => (
            <li key={instruments.id}>
              {instruments.name}
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}

export default App
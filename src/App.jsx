function UserCard(props) {
  return <h2>Hii gaiss, nama I {props.nama}!</h2>;
}

function App() {
  return (
    <>
      <div>
        <h1>Halo, Sekai!</h1>
        <p>Ini namanya Website Tpi mau diisi kanji ntar</p>
      </div>
      <div>
        <UserCard nama="Mijaenn" />
        <UserCard nama="Bukan Mijaenn" />
      </div>
    </>
  );
}

export default App;
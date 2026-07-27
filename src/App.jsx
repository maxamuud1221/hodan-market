import { useState } from 'react'

const sampleAds = [
  { id: 1, title: 'Baabuur Toyota 2015', price: '8,500 $', location: 'Muqdisho' },
  { id: 2, title: 'Moobil Samsung A54', price: '250 $', location: 'Hargeysa' },
  { id: 3, title: 'Guri kiro ah - 2 qol', price: '400 $/bil', location: 'Boosaaso' },
]

export default function App() {
  const [search, setSearch] = useState('')

  const filtered = sampleAds.filter((ad) =>
    ad.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Suuq Soomaali</h1>
      <p>Meesha aad ku iibin karto oo aad ku iibsan karto wax kasta.</p>

      <input
        type="text"
        placeholder="Raadi alaab..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 20 }}
      />

      {filtered.map((ad) => (
        <div key={ad.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 15, marginBottom: 10 }}>
          <h3 style={{ margin: 0 }}>{ad.title}</h3>
          <p style={{ margin: '5px 0' }}>{ad.price} — {ad.location}</p>
        </div>
      ))}
    </div>
  )
}

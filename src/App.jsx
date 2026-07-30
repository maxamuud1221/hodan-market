import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './index.css'

function App() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Dhammaan')

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const categories = ['Dhammaan', 'Baabuur', 'Moobiil', 'Guryo', 'Dharka', 'Kale']

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching listings:', error)
    } else {
      setListings(data)
    }
    setLoading(false)
  }

  async function handleAddListing(e) {
    e.preventDefault()
    setUploading(true)

    let imageUrl = ''

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        setUploading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    const { error: insertError } = await supabase
      .from('listings')
      .insert([
        {
          title,
          price: parseFloat(price),
          description,
          category,
          seller_name: sellerName,
          image_url: imageUrl,
        },
      ])

    if (insertError) {
      console.error('Error adding listing:', insertError)
    } else {
      setTitle('')
      setPrice('')
      setDescription('')
      setCategory('')
      setSellerName('')
      setImageFile(null)
      setShowForm(false)
      fetchListings()
    }

    setUploading(false)
  }

  const filteredListings =
    activeCategory === 'Dhammaan'
      ? listings
      : listings.filter((item) => item.category === activeCategory)

  return (
    <div className="app">
      <header className="header">
        <h1>SuuqSoomaali</h1>
        <input type="text" placeholder="Raadi wax..." className="search-bar" />
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? 'Xir' : '+ Ku dar Alaab'}
        </button>
      </header>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? 'category-btn active' : 'category-btn'}
          >
            {cat}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAddListing} className="listing-form">
          <input
            type="text"
            placeholder="Magaca alaabta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Qiimaha"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Dooro qaybta</option>
            {categories.filter((c) => c !== 'Dhammaan').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            placeholder="Sharaxaad"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Magacaaga (iibiyaha)"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Waa la shubayaa...' : 'Ku dar Alaabta'}
          </button>
        </form>
      )}

      <div className="listings-grid">
        {loading ? (
          <p>Waa la soo raraya...</p>
        ) : filteredListings.length === 0 ? (
          <p>Alaab lama helin qaybtan.</p>
        ) : (
          filteredListings.map((item) => (
            <div key={item.id} className="listing-card">
              {item.image_url && <img src={item.image_url} alt={item.title} />}
              <h3>{item.title}</h3>
              <p className="price">${item.price}</p>
              <p>{item.description}</p>
              <p className="seller">Iibiyaha: {item.seller_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App

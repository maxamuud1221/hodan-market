import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import './index.css'

const translations = {
  so: {
    appName: 'Hodan Market',
    loading: 'Waa la sugayaa...',
    search: 'Raadi wax...',
    close: 'Xir',
    addItem: '+ Ku dar Alaab',
    logout: 'Ka Bax',
    itemTitle: 'Magaca alaabta',
    price: 'Qiimaha',
    chooseCategory: 'Dooro qaybta',
    description: 'Sharaxaad',
    sellerName: 'Magacaaga (iibiyaha)',
    sellerPhone: 'Lambarka WhatsApp',
    submitting: 'Waa la shubayaa...',
    submit: 'Ku dar Alaabta',
    loadingListings: 'Waa la soo raraya...',
    noListings: 'Alaab lama helin qaybtan.',
    seller: 'Iibiyaha',
    backToListings: '← Dib ugu noqo',
    contactSeller: 'La xiriir Iibiyaha (WhatsApp)',
    deleteListing: 'Tirtir Alaabta',
    deleteConfirm: 'Ma hubtaa inaad tirtirto alaabtan?',
    deleting: 'Waa la tirtirayaa...',
    categories: {
      Dhammaan: 'Dhammaan',
      Baabuur: 'Baabuur',
      Moobiil: 'Moobiil',
      Guryo: 'Guryo',
      Dharka: 'Dharka',
      Kale: 'Kale',
    },
  },
  en: {
    appName: 'Hodan Market',
    loading: 'Loading...',
    search: 'Search...',
    close: 'Close',
    addItem: '+ Add Item',
    logout: 'Log Out',
    itemTitle: 'Item name',
    price: 'Price',
    chooseCategory: 'Choose category',
    description: 'Description',
    sellerName: 'Your name (seller)',
    sellerPhone: 'WhatsApp number',
    submitting: 'Uploading...',
    submit: 'Add Item',
    loadingListings: 'Loading...',
    noListings: 'No items found in this category.',
    seller: 'Seller',
    backToListings: '← Back to listings',
    contactSeller: 'Contact Seller (WhatsApp)',
    deleteListing: 'Delete Item',
    deleteConfirm: 'Are you sure you want to delete this item?',
    deleting: 'Deleting...',
    categories: {
      Dhammaan: 'All',
      Baabuur: 'Vehicles',
      Moobiil: 'Mobile',
      Guryo: 'Housing',
      Dharka: 'Clothing',
      Kale: 'Other',
    },
  },
}

function App() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [lang, setLang] = useState('so')
  const t = translations[lang]

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Dhammaan')
  const [searchQuery, setSearchQuery] = useState('')

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [sellerPhone, setSellerPhone] = useState('')
  const [city, setCity] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [selectedListing, setSelectedListing] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const categoryKeys = ['Dhammaan', 'Baabuur', 'Moobiil', 'Guryo', 'Dharka', 'Kale']
  const cities = [
  'Muqdisho',
  'Hargeisa',
  'Boosaaso',
  'Kismaayo',
  'Baydhabo',
  'Garowe',
  'Burco',
  'Galkacyo',
  'Jowhar',
  'Beledweyne',
  'Marka',
  'Dhuusamareeb',
  'Laascaanood',
  'Ceerigaabo'
]
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setCheckingSession(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    if (session?.user?.email) {
      setSellerName(session.user.email)
    }
  }, [session])

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
          city,
          seller_name: sellerName,
          seller_phone: sellerPhone,
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
      setCity('')
      setSellerPhone('')
      setImageFile(null)
      setShowForm(false)
      fetchListings()
    }

    setUploading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleDeleteListing(id) {
    if (!window.confirm(t.deleteConfirm)) return
    setDeleting(true)
    const { error } = await supabase.from('listings').delete().eq('id', id)
    if (error) {
      console.error('Error deleting listing:', error)
    } else {
      setSelectedListing(null)
      fetchListings()
    }
    setDeleting(false)
  }

  const filteredListings = listings
    .filter((item) =>
      activeCategory === 'Dhammaan' ? true : item.category === activeCategory
    )
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

  if (checkingSession) {
    return <p style={{ textAlign: 'center', marginTop: 60 }}>{t.loading}</p>
  }

  if (!session) {
    return <Auth onLogin={(user) => setSession({ user })} />
  }

  if (selectedListing) {
    const item = selectedListing
    const cleanPhone = (item.seller_phone || '').replace(/[^0-9]/g, '')
    return (
      <div className="app">
        <header className="header">
          <h1>{t.appName}</h1>
        </header>
        <button onClick={() => setSelectedListing(null)} className="add-btn" style={{ margin: '12px' }}>
          {t.backToListings}
        </button>
        <div className="listing-card" style={{ maxWidth: 500, margin: '0 auto' }}>
          {item.image_url && <img src={item.image_url} alt={item.title} />}
          <h3>{item.title}</h3>
          <p className="price">${item.price}</p>

<p style={{padding:"0 15px",color:"#374151"}}>
  {item.description}
</p>

<p className="seller">
📍 Soomaaliya
<br/>
👤 {item.seller_name}
</p>
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Salaan, waxaan ka xiisaynayaa: ' + item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="add-btn"
              style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}
            >
              {t.contactSeller}
            </a>
          )}
          {session.user.email === item.seller_name && (
            <button
              onClick={() => handleDeleteListing(item.id)}
              disabled={deleting}
              className="add-btn"
              style={{ display: 'block', marginTop: 12 }}
            >
              {deleting ? t.deleting : t.deleteListing}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>{t.appName}</h1>
        <input
          type="text"
          placeholder={t.search}
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setLang(lang === 'so' ? 'en' : 'so')}
          className="add-btn"
          style={{ marginLeft: 8 }}
        >
          {lang === 'so' ? 'EN' : 'SO'}
        </button>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? t.close : t.addItem}
        </button>
        <div className="user-menu">
          <button
            className="user-avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {session.user.email.charAt(0).toUpperCase()}
          </button>
          {showUserMenu && (
            <div className="user-dropdown">
              <p className="user-email">{session.user.email}</p>
              <button onClick={handleLogout} className="user-logout-btn">
                {t.logout}
              </button>
            </div>
          )}
        </div>
      </header>
<section className="hero">
  <div className="hero-content">
    <h2>🇸🇴 Suuqa ugu weyn Soomaaliya</h2>

    <p>
      Ka iibso oo ku iibi alaabtaada si fudud, ammaan ah, oo degdeg ah.
    </p>

    <button
      className="hero-btn"
      onClick={() => setShowForm(true)}
    >
      🚀 Ku dar Alaab Hadda
    </button>
  </div>
</section>
      <div className="category-filters">
        {categoryKeys.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={activeCategory === cat ? 'category-btn active' : 'category-btn'}
          >
            {t.categories[cat]}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAddListing} className="listing-form">
          <input
            type="text"
            placeholder={t.itemTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
         <select
  value={city}
  onChange={(e) => setCity(e.target.value)}
  required
>
  <option value="">📍 Dooro Magaalada</option>

  {cities.map((c) => (
    <option key={c} value={c}>
      {c}
    </option>
  ))}
</select>
          
        <input
            type="number"
            placeholder={t.price}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">{t.chooseCategory}</option>
            {categoryKeys.filter((c) => c !== 'Dhammaan').map((cat) => (
              <option key={cat} value={cat}>{t.categories[cat]}</option>
            ))}
          </select>
          <textarea
            placeholder={t.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder={t.sellerName}
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
          />
          <input
            type="tel"
            placeholder={t.sellerPhone}
            value={sellerPhone}
            onChange={(e) => setSellerPhone(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button type="submit" disabled={uploading}>
            {uploading ? t.submitting : t.submit}
          </button>
        </form>
      )}

      <div className="listings-grid">
        {loading ? (
          <p>{t.loadingListings}</p>
        ) : filteredListings.length === 0 ? (
          <p>{t.noListings}</p>
        ) : (
          filteredListings.map((item) => (
            <div
              key={item.id}
              className="listing-card"
              onClick={() => setSelectedListing(item)}
              style={{ cursor: 'pointer' }}
            >
              {item.image_url && <img src={item.image_url} alt={item.title} />}
             <h3>{item.title}</h3>

<p className="price">$ {item.price}</p>

<p className="listing-location">📍 Soomaaliya</p>

<p className="listing-description">
  {item.description.length > 70
    ? item.description.substring(0, 70) + "..."
    : item.description}
</p>

<p className="seller">
👤 {item.seller_name}
</p>

<button className="view-btn">
Faahfaahin
</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App

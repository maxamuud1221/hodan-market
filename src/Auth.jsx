import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage('Khalad: ' + error.message)
      } else {
        setMessage('Waad ku guulaysatay! Hubi email-kaaga si aad u xaqiijiso, ka dibna soo gal.')
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage('Khalad: ' + error.message)
      } else {
        onLogin(data.user)
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 350, margin: '60px auto', padding: 20 }}>
      <h2>{isSignUp ? 'Diiwaangelin' : 'Soo Gal'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Sugaya...' : isSignUp ? 'Diiwaan Geli' : 'Soo Gal'}
        </button>
      </form>
      {message && <p style={{ marginTop: 10, color: message.startsWith('Khalad') ? 'red' : 'green' }}>{message}</p>}
      <p style={{ marginTop: 15, textAlign: 'center' }}>
        {isSignUp ? 'Horey ma u lahayd account?' : 'Ma lihid account?'}{' '}
        <button
          type="button"
          onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignUp ? 'Soo Gal' : 'Diiwaan Geli'}
        </button>
      </p>
    </div>
  )
}

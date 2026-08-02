
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-badge">H</span>
          <h1>Hodan Market</h1>
        </div>
        <p className="auth-subtitle">
          {isSignUp ? 'Samee account cusub si aad u iibiso oo aad u iibsato' : 'Ku soo dhawoow, soo gal si aad u sii wadato'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="tusaale@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Sugaya...' : isSignUp ? 'Diiwaan Geli' : 'Soo Gal'}
          </button>
        </form>

        {message && (
          <p className={message.startsWith('Khalad') ? 'auth-message auth-error' : 'auth-message auth-success'}>
            {message}
          </p>
        )}

        <p className="auth-toggle">
          {isSignUp ? 'Horey ma u lahayd account?' : 'Ma lihid account?'}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
            className="auth-toggle-btn"
          >
            {isSignUp ? 'Soo Gal' : 'Diiwaan Geli'}
          </button>
        </p>
      </div>
    </div>
  )
}

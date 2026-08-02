
import { useState } from 'react'
import { supabase } from './supabaseClient'

const authText = {
  so: {
    welcomeSignIn: 'Ku soo dhawoow, soo gal si aad u sii wadato',
    welcomeSignUp: 'Samee account cusub si aad u iibiso oo aad u iibsato',
    email: 'Email',
    password: 'Password',
    signIn: 'Soo Gal',
    signUp: 'Diiwaan Geli',
    submitting: 'Sugaya...',
    noAccount: 'Ma lihid account?',
    hasAccount: 'Horey ma u lahayd account?',
    signUpSuccess: 'Waad ku guulaysatay! Hubi email-kaaga si aad u xaqiijiso, ka dibna soo gal.',
    error: 'Khalad: ',
  },
  en: {
    welcomeSignIn: 'Welcome back, sign in to continue',
    welcomeSignUp: 'Create an account to buy and sell',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    submitting: 'Loading...',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUpSuccess: 'Success! Check your email to confirm, then sign in.',
    error: 'Error: ',
  },
}

export default function Auth({ onLogin, lang, setLang }) {
  const t = authText[lang]

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(t.error + error.message)
        setIsError(true)
      } else {
        setMessage(t.signUpSuccess)
        setIsError(false)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(t.error + error.message)
        setIsError(true)
      } else {
        onLogin(data.user)
      }
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <button
        onClick={() => setLang(lang === 'so' ? 'en' : 'so')}
        className="auth-lang-btn"
      >
        {lang === 'so' ? 'EN' : 'SO'}
      </button>

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-badge">H</span>
          <h1>Hodan Market</h1>
        </div>
        <p className="auth-subtitle">
          {isSignUp ? t.welcomeSignUp : t.welcomeSignIn}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>{t.email}</label>
            <input
              type="email"
              placeholder="tusaale@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>{t.password}</label>
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
            {loading ? t.submitting : isSignUp ? t.signUp : t.signIn}
          </button>
        </form>

        {message && (
          <p className={isError ? 'auth-message auth-error' : 'auth-message auth-success'}>
            {message}
          </p>
        )}

        <p className="auth-toggle">
          {isSignUp ? t.hasAccount : t.noAccount}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
            className="auth-toggle-btn"
          >
            {isSignUp ? t.signIn : t.signUp}
          </button>
        </p>
      </div>
    </div>
  )
}

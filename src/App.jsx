<header className="header">

  <div className="logo">
    <h1>🛍️ Hodan Market</h1>
    <span>Buy • Sell • Discover</span>
  </div>

  <input
    type="text"
    placeholder={t.search}
    className="search-bar"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  <div className="header-actions">

    <button
      onClick={() => setLang(lang === "so" ? "en" : "so")}
      className="lang-btn"
    >
      {lang === "so" ? "EN" : "SO"}
    </button>

    <button
      onClick={() => setShowForm(!showForm)}
      className="add-btn"
    >
      ➕ {showForm ? t.close : t.addItem}
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

          <p className="user-email">
            {session.user.email}
          </p>

          <button
            onClick={handleLogout}
            className="user-logout-btn"
          >
            {t.logout}
          </button>

        </div>
      )}

    </div>

  </div>

</header>

import { Outlet, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/books', label: 'Books' },
  { to: '/weather', label: 'Weather' },
  { to: '/cloud-security-policy', label: 'Cloud Security' },
];

const sideLinks = [
  { href: 'http://it4203.azurewebsites.net/', label: 'IT 4203 Course Site', external: true },
  { to: '/books', label: 'Google Books Search' },
  { to: '/weather', label: 'Weather App' },
  { to: '/cloud-security-policy', label: 'Cloud Security Policy' },
];

export default function Layout() {
  return (
    <div id="shell">
      <header id="header">
        <h1>Advanced<span>Web Development</span></h1>
        <h2>by Abayomi Osota</h2>
      </header>

      <nav>
        <ul>
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div id="body-row">
        <aside id="sidebar">
          <h3>Links</h3>
          <ul>
            {sideLinks.map(({ to, href, label, external }) => (
              <li key={label}>
                {external ? (
                  <a href={href} target="_blank" rel="noreferrer">{label}</a>
                ) : (
                  <NavLink
                    to={to}
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                  >
                    {label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main id="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

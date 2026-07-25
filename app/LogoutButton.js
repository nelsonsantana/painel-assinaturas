'use client';

export default function LogoutButton() {
  async function sair() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.reload();
  }

  return (
    <button className="logout-btn" onClick={sair}>
      Sair
    </button>
  );
}

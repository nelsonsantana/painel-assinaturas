'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setErro('Senha incorreta');
      }
    } catch {
      setErro('Erro ao conectar. Tenta de novo.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={entrar}>
        <h1>🔒 Controle de Assinaturas</h1>
        <p>Digite a senha para ver os vencimentos</p>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        {erro && <div className="erro">{erro}</div>}
      </form>
    </div>
  );
}

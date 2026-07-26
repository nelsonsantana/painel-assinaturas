'use client';

import { useState } from 'react';

export default function RenovarButton({ conta, cliente }) {
  const [estado, setEstado] = useState('idle'); // idle | carregando | sucesso | erro
  const [erro, setErro] = useState('');

  if (!conta) return null; // dado antigo, sem código de conta salvo ainda

  async function renovar() {
    const confirmado = window.confirm(
      `Renovar a assinatura de "${cliente}" agora?\n\nIsso consome 1 crédito real da sua conta no ResellerSystem e não pode ser desfeito.`
    );
    if (!confirmado) return;

    setEstado('carregando');
    setErro('');
    try {
      const res = await fetch('/api/renovar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conta }),
      });
      const dados = await res.json();
      if (!res.ok || !dados.ok) {
        throw new Error(dados.erro || `Erro HTTP ${res.status}`);
      }
      setEstado('sucesso');
    } catch (err) {
      setEstado('erro');
      setErro(err.message);
    }
  }

  if (estado === 'sucesso') {
    return <span className="renovar-btn renovar-ok">✅ Renovado</span>;
  }

  return (
    <div className="renovar-wrap">
      <button className="renovar-btn" onClick={renovar} disabled={estado === 'carregando'}>
        {estado === 'carregando' ? 'Renovando...' : 'Renovar'}
      </button>
      {estado === 'erro' && <div className="renovar-erro">{erro}</div>}
    </div>
  );
}

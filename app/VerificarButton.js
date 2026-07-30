'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificarButton() {
  const [estado, setEstado] = useState('idle'); // idle | carregando | erro
  const [erro, setErro] = useState('');
  const router = useRouter();

  async function verificar() {
    setEstado('carregando');
    setErro('');
    try {
      const res = await fetch('/api/verificar', { method: 'POST' });
      const dados = await res.json();
      if (!res.ok || !dados.ok) {
        throw new Error(dados.erro || `Erro HTTP ${res.status}`);
      }
      setEstado('idle');
      router.refresh();
    } catch (err) {
      setEstado('erro');
      setErro(err.message);
    }
  }

  return (
    <div className="verificar-wrap">
      <button className="verificar-btn" onClick={verificar} disabled={estado === 'carregando'}>
        {estado === 'carregando' ? 'Verificando...' : '🔄 Verificar agora'}
      </button>
      {estado === 'erro' && <div className="verificar-erro">{erro}</div>}
    </div>
  );
}

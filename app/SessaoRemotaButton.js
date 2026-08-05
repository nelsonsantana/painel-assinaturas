'use client';

import { useEffect, useRef, useState } from 'react';

const TEXTO_STATUS = {
  aguardando: 'Aguardando você concluir o login na outra aba...',
  concluido: '✅ Sessão renovada com sucesso!',
  erro: 'Falhou — tenta de novo',
};

export default function SessaoRemotaButton() {
  const [estado, setEstado] = useState('idle'); // idle | aguardando | concluido | erro
  const [erro, setErro] = useState('');
  const pollRef = useRef(null);

  useEffect(() => () => clearInterval(pollRef.current), []);

  function pararPolling() {
    clearInterval(pollRef.current);
    pollRef.current = null;
  }

  function iniciarPolling() {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/sessao-remota/status', { cache: 'no-store' });
        const dados = await res.json();
        if (!res.ok || !dados.ok) throw new Error(dados.erro || `Erro HTTP ${res.status}`);

        if (dados.status === 'concluido') {
          setEstado('concluido');
          pararPolling();
        } else if (dados.status === 'erro') {
          setEstado('erro');
          setErro(dados.erro || 'Sessão expirou ou falhou.');
          pararPolling();
        }
        // status "aguardando" — continua esperando
      } catch (err) {
        setEstado('erro');
        setErro(err.message);
        pararPolling();
      }
    }, 3000);
  }

  async function iniciar() {
    setEstado('aguardando');
    setErro('');
    try {
      const res = await fetch('/api/sessao-remota/iniciar', { method: 'POST' });
      const dados = await res.json();
      if (!res.ok || !dados.ok) {
        throw new Error(dados.erro || `Erro HTTP ${res.status}`);
      }
      // Navegação de verdade pra outra aba (não iframe) — evita bloqueio de
      // conteúdo misto https→http do navegador.
      window.open(dados.url, '_blank', 'noopener,noreferrer');
      iniciarPolling();
    } catch (err) {
      setEstado('erro');
      setErro(err.message);
    }
  }

  return (
    <div className="sessao-wrap">
      <button className="sessao-btn" onClick={iniciar} disabled={estado === 'aguardando'}>
        {estado === 'aguardando' ? 'Aguardando login...' : '🔓 Renovar sessão'}
      </button>
      {(estado === 'aguardando' || estado === 'concluido' || estado === 'erro') && (
        <div className={`sessao-status sessao-status-${estado}`}>{erro || TEXTO_STATUS[estado]}</div>
      )}
    </div>
  );
}

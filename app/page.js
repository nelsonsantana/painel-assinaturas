// app/page.js
import { cookies } from 'next/headers';
import { COOKIE_NAME, tokenEsperado } from '../lib/auth';
import { redis, SNAPSHOT_KEY } from '../lib/redis';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';

// Nunca faz cache dessa página — sempre busca o dado mais recente do Redis.
export const dynamic = 'force-dynamic';

function estaAutenticado() {
  const cookieStore = cookies();
  const valor = cookieStore.get(COOKIE_NAME)?.value;
  return valor === tokenEsperado();
}

function Card({ item, tipo }) {
  const dias = item.diasRestantes;
  const texto =
    tipo === 'vencido'
      ? `Venceu há ${Math.abs(dias)} dia(s)`
      : `${dias} dia(s) restante(s)`;
  const badge = { vencido: 'VENCIDO', urgente: 'URGENTE', atencao: 'ATENÇÃO' }[tipo];

  return (
    <div className={`card ${tipo}`}>
      <div>
        <div className="nome">{item.cliente}</div>
        <div className="dias">{texto}</div>
      </div>
      <span className={`badge ${tipo}`}>{badge}</span>
    </div>
  );
}

export default async function Page() {
  if (!estaAutenticado()) {
    return <LoginForm />;
  }

  const snapshot = await redis.get(SNAPSHOT_KEY);

  const vencidos = snapshot?.vencidos || [];
  const urgente = snapshot?.urgente || [];
  const atencao = snapshot?.atencao || [];
  const total = vencidos.length + urgente.length + atencao.length;

  const dataFormatada = snapshot?.geradoEm
    ? new Date(snapshot.geradoEm).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>📋 Assinaturas</h1>
          {dataFormatada && <div className="data">Atualizado em {dataFormatada}</div>}
        </div>
        <LogoutButton />
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <div className="emoji">✅</div>
          {snapshot ? 'Nenhum vencimento próximo.' : 'Ainda não recebi nenhum dado do robô.'}
        </div>
      ) : (
        <>
          {vencidos.length > 0 && (
            <>
              <div className="section-title">🔴 Vencidos ({vencidos.length})</div>
              {vencidos.map((item, i) => (
                <Card key={i} item={item} tipo="vencido" />
              ))}
            </>
          )}
          {urgente.length > 0 && (
            <>
              <div className="section-title">🟡 Renovar agora ({urgente.length})</div>
              {urgente.map((item, i) => (
                <Card key={i} item={item} tipo="urgente" />
              ))}
            </>
          )}
          {atencao.length > 0 && (
            <>
              <div className="section-title">🟠 Atenção ({atencao.length})</div>
              {atencao.map((item, i) => (
                <Card key={i} item={item} tipo="atencao" />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

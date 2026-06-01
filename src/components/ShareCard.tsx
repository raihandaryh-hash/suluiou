import { forwardRef } from 'react';

export type ShareCardProps = {
  value: string;
  label: string;
  artinya: string;
  persona: 'siswa' | 'orangtua' | 'gurubk';
  source: string;
};

const personaLabel: Record<ShareCardProps['persona'], string> = {
  siswa: 'Untuk Siswa',
  orangtua: 'Untuk Orang Tua',
  gurubk: 'Untuk Guru BK',
};

/**
 * Off-screen template rendered at 1080x1920 (9:16) for html2canvas capture.
 * Sized in actual pixels (not Tailwind) so capture is resolution-stable
 * regardless of viewport. Scaled to fit via CSS transform from the hook.
 */
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { value, label, artinya, persona, source },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        width: '1080px',
        height: '1920px',
        backgroundColor: 'hsl(213, 62%, 18%)',
        backgroundImage:
          'linear-gradient(160deg, hsl(213, 62%, 22%) 0%, hsl(213, 62%, 14%) 100%)',
        color: '#ffffff',
        fontFamily: '"Inter", system-ui, sans-serif',
        padding: '90px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow accent */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, hsla(42, 68%, 54%, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '52px',
            color: 'hsl(42, 68%, 60%)',
            letterSpacing: '-0.02em',
          }}
        >
          sulu
        </div>
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {personaLabel[persona]}
        </div>
      </div>

      {/* Center stat */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '180px',
            lineHeight: 1,
            color: 'hsl(42, 68%, 60%)',
            letterSpacing: '-0.04em',
            wordBreak: 'break-word',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '38px',
            lineHeight: 1.3,
            color: 'rgba(255,255,255,0.92)',
            fontWeight: 500,
            maxWidth: '880px',
          }}
        >
          {label}
        </div>

        <div
          style={{
            height: '2px',
            width: '120px',
            backgroundColor: 'hsla(42, 68%, 60%, 0.6)',
            marginTop: '20px',
          }}
        />

        <div
          style={{
            fontSize: '34px',
            lineHeight: 1.45,
            color: 'rgba(255,255,255,0.88)',
            fontStyle: 'italic',
            maxWidth: '900px',
          }}
        >
          {artinya}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '720px',
            lineHeight: 1.4,
          }}
        >
          Sumber: {source}
        </div>
        <div
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: '22px',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          suluiou.lovable.app
        </div>
      </div>
    </div>
  );
});

export default ShareCard;

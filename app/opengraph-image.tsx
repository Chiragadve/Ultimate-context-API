import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Ultimate Context API';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: 'linear-gradient(to bottom right, #000000, #111111)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <div
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 800,
                        paddingBottom: 20,
                    }}
                >
                    Ultimate Context
                </div>
                <div style={{ fontSize: 48, marginTop: 20, color: '#888' }}>
                    Real-time context in milliseconds
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

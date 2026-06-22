import { ImageResponse } from 'next/og'
 
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg viewBox="0 0 100 100" width="32" height="32" fill="#15803d">
          <polygon points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}

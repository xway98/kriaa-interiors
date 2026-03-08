// KRiAA text logo using Colonna MT Std (served from /fonts/)
// 'i' is always crimson; KR+AA inherit currentColor (theme-adaptive)
interface Props {
    size?: 'sm' | 'md' | 'lg';
}

export default function KriaaLogo({ size = 'md' }: Props) {
    const heights: Record<string, string> = { sm: '30px', md: '40px', lg: '54px' };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 310 68"
            style={{ height: heights[size], width: 'auto', display: 'block' }}
            aria-label="KRiAA Interiors"
        >
            {/* KR — theme color */}
            <text
                x="0"
                y="48"
                fontFamily="'Colonna MT Std', 'Colonna MT', serif"
                fontSize="56"
                fontWeight="400"
                fill="currentColor"
            >
                KR
            </text>

            {/* i — always crimson */}
            <text
                x="87"
                y="48"
                fontFamily="'Colonna MT Std', 'Colonna MT', serif"
                fontSize="56"
                fontWeight="400"
                fill="#9b1c3a"
            >
                i
            </text>

            {/* AA — theme color */}
            <text
                x="105"
                y="48"
                fontFamily="'Colonna MT Std', 'Colonna MT', serif"
                fontSize="56"
                fontWeight="400"
                fill="currentColor"
            >
                AA
            </text>

            {/* INTERIORS — smaller tagline */}
            <text
                x="1"
                y="63"
                fontFamily="'Outfit', 'Inter', sans-serif"
                fontSize="10"
                fontWeight="300"
                fill="currentColor"
                letterSpacing="5"
                opacity="0.55"
            >
                INTERIORS
            </text>
        </svg>
    );
}

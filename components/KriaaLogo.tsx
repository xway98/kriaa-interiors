// KRiAA text logo — themed, with red 'i'
// Colonna MT / Didot serif style rendered as SVG text
interface Props {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function KriaaLogo({ className = '', size = 'md' }: Props) {
    const heights: Record<string, string> = { sm: '28px', md: '36px', lg: '48px' };
    const h = heights[size];

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 280 60"
            style={{ height: h, width: 'auto' }}
            className={className}
            aria-label="KRiAA Interiors"
        >
            {/* Load Playfair Display as the closest web-available serif to Colonna MT */}
            {/* KR - theme colored */}
            <text
                x="0"
                y="44"
                fontFamily="'Playfair Display', 'Didot', 'Georgia', serif"
                fontSize="52"
                fontWeight="400"
                fill="currentColor"
                letterSpacing="-1"
            >
                KR
            </text>
            {/* i - always crimson/red */}
            <text
                x="80"
                y="44"
                fontFamily="'Playfair Display', 'Didot', 'Georgia', serif"
                fontSize="52"
                fontWeight="400"
                fill="#9b1c3a"
                letterSpacing="-1"
                fontStyle="italic"
            >
                i
            </text>
            {/* AA - theme colored */}
            <text
                x="97"
                y="44"
                fontFamily="'Playfair Display', 'Didot', 'Georgia', serif"
                fontSize="52"
                fontWeight="400"
                fill="currentColor"
                letterSpacing="-1"
            >
                AA
            </text>
            {/* Interiors subtitle */}
            <text
                x="1"
                y="57"
                fontFamily="'Outfit', 'Inter', sans-serif"
                fontSize="10.5"
                fontWeight="300"
                fill="currentColor"
                letterSpacing="4.5"
                opacity="0.65"
            >
                INTERIORS
            </text>
        </svg>
    );
}

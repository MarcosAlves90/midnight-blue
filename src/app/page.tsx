import ParallaxBackground from '@/components/parallax-background'
import EnterButton from '@/components/enter-button'

export default function Home() {

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* Background image from Cloudinary */}
      <ParallaxBackground
        src="https://res.cloudinary.com/dflvo098t/image/upload/landing-page_vgw7yx.gif"
        alt="Midnight Blue Background"
        intensity={8}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="space-y-8">
          {/* Top title */}
          <h2 className="text-white/90 text-base md:text-lg lg:text-xl tracking-[0.2em] font-[family-name:var(--font-futura-pro-book)] uppercase font-bold">
            The Mental World: Ano 1
          </h2>
          
          {/* Main title */}
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-brevis)] tracking-wide">
            MidNight
          </h1>
          
          {/* Subtle subtitle */}
          <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto font-[family-name:var(--font-futura-pro-book)]">
            Clearance Nível ÔMEGA. Terminal de acesso classificado Sevastopol.
          </p>
          
          {/* Enter Button */}
          <div className="mt-10">
            <EnterButton />
          </div>
        </div>
      </div>
      
      {/* Subtle bottom element */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 hover:text-white transition-colors duration-300 cursor-pointer group z-20 py-4 px-8">
        <div className="w-px h-8 bg-white/20 group-hover:bg-white mx-auto mb-2 transition-colors duration-300"></div>
        <p className="text-xs tracking-wider font-[family-name:var(--font-futura-pro-book)]">
          SCROLL
        </p>
      </div>
    </div>
  );
}

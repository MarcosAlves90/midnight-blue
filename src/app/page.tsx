import ParallaxBackground from "@/components/parallax-background";
import EnterButton from "@/components/enter-button";
import GlitchText from "@/components/glitch-text";
import { APP_VERSION } from "@/lib/version";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        <ParallaxBackground
          src="midnight-main-menu_bafpwg.gif"
          alt="Midnight Blue Background"
          intensity={8}
        />
        <div className="space-y-8 relative z-10">
          <h2 className="text-white/90 text-base md:text-lg lg:text-xl tracking-[0.2em] font-[family-name:var(--font-futura-pro-book)] uppercase font-bold">
            The Mental World: Ano 1
          </h2>

          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-brevis)] tracking-wide">
            <GlitchText
              glitchChance={0.03}
              glitchDuration={300}
              intervalMs={200}
              alternateText="Basilisc"
              className="inline-block"
            >
              MidNight
            </GlitchText>
          </h1>

          <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto font-[family-name:var(--font-futura-pro-book)]">
            <GlitchText
              glitchChance={0.05}
              glitchDuration={200}
              intervalMs={150}
            >
              Clearance Nível ÔMEGA. Terminal de acesso classificado Sevastopol.
            </GlitchText>
          </p>

          <div className="mt-10">
            <EnterButton />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 hover:text-white transition-colors duration-300 cursor-pointer group z-20 py-4 px-8">
          <div className="w-px h-8 bg-white/20 group-hover:bg-white mx-auto mb-2 transition-colors duration-300"></div>
          <p className="text-xs tracking-wider font-[family-name:var(--font-futura-pro-book)]">
            SCROLL
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative backdrop-blur-sm overflow-hidden border-t border-white/10">
        <ParallaxBackground
          src="landing-page_vgw7yx.gif"
          alt="Midnight Blue Background"
          intensity={8}
          overlayType="black"
        />
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-white text-center md:text-start text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-futura-pro-book)] uppercase font-bold">
                The Mental World: Ano 1
              </h3>
              <p className="text-white/80 font-[family-name:var(--font-futura-pro-book)] leading-relaxed">
                Houve uma época em que a existência da energia não era
                conhecida. Quando isso mudou, a humanidade foi dominada por
                organizações e pessoas arrogantes. A influência que exerciam
                sobre a sociedade causou efeitos inimagináveis. Mal sabiam eles
                o destino que seriam forçados a encarar. Esse era o fim dos
                tempos. Não havia nenhuma chance de sobrevivência. E foi assim
                que vocês morreram.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-white/60">
                  <span className="text-white font-bold">Sistema:</span>{" "}
                  MidNight Blue {APP_VERSION}
                </div>
                <div className="text-white/60">
                  <span className="text-white font-bold">Gênero:</span> Ficção
                  Científica
                </div>
                <div className="text-white/60">
                  <span className="text-white font-bold">Jogadores:</span> 3-11
                </div>
                <div className="text-white/60">
                  <span className="text-white font-bold">Duração:</span>{" "}
                  Campanha
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-lg border border-white/10 backdrop-blur-sm">
                <h4 className="text-white text-lg sm:text-xl text-center font-[family-name:var(--font-brevis)] mb-4">
                  Qual carne é a sua carne?
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-3 rounded-lg border border-red-400/30 hover:from-red-500/30 hover:to-orange-500/30 transition-all duration-300 cursor-pointer text-center">
                    <span className="text-xl block mb-2">⚙️</span>
                    <h5 className="text-white font-bold text-xs font-[family-name:var(--font-brevis)] mb-1">
                      Controle
                    </h5>
                    <p className="text-white/70 text-xs font-[family-name:var(--font-futura-pro-book)]">
                      Dominar caos
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-lg border border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer text-center">
                    <span className="text-xl block mb-2">⚖️</span>
                    <h5 className="text-white font-bold text-xs font-[family-name:var(--font-brevis)] mb-1">
                      Equilíbrio
                    </h5>
                    <p className="text-white/70 text-xs font-[family-name:var(--font-futura-pro-book)]">
                      Equilibrar tudo
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 col-span-2 lg:col-span-1 to-cyan-500/20 p-3 rounded-lg border border-blue-400/30 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer text-center">
                    <span className="text-xl block mb-2">🕊️</span>
                    <h5 className="text-white font-bold text-xs font-[family-name:var(--font-brevis)] mb-1">
                      Liberdade
                    </h5>
                    <p className="text-white/70 text-xs font-[family-name:var(--font-futura-pro-book)]">
                      Quebrar correntes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-20">
          <h3 className="text-white text-3xl md:text-4xl font-[family-name:var(--font-brevis)] text-center mb-12">
            Recursos do Sistema
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">⚡</span>
              </div>
              <h4 className="text-white text-xl font-[family-name:var(--font-brevis)]">
                Fichas Dinâmicas
              </h4>
              <p className="text-white/70 text-sm font-[family-name:var(--font-futura-pro-book)]">
                Controle total das fichas: edite, acompanhe e veja mudanças
                instantâneas durante a sessão.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-xl">📚</span>
              </div>
              <h4 className="text-white text-xl font-[family-name:var(--font-brevis)]">
                Wiki Integrada
              </h4>
              <p className="text-white/70 text-sm font-[family-name:var(--font-futura-pro-book)]">
                Consulte regras, lore, arquivos secretos e protocolos direto do
                sistema.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400 text-xl">☁️</span>
              </div>
              <h4 className="text-white text-xl font-[family-name:var(--font-brevis)]">
                Dados na Nuvem
              </h4>
              <p className="text-white/70 text-sm font-[family-name:var(--font-futura-pro-book)]">
                Suas fichas e progresso ficam salvos automaticamente no
                Firebase. Segurança e acesso de qualquer lugar.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-16 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-[family-name:var(--font-brevis)] text-white">
                10
              </div>
              <div className="text-white/60 text-sm font-[family-name:var(--font-futura-pro-book)] uppercase tracking-wider">
                Agentes da Crow Crew
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-[family-name:var(--font-brevis)] text-white">
                4
              </div>
              <div className="text-white/60 text-sm font-[family-name:var(--font-futura-pro-book)] uppercase tracking-wider">
                Missões Ativas
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-[family-name:var(--font-brevis)] text-white">
                6
              </div>
              <div className="text-white/60 text-sm font-[family-name:var(--font-futura-pro-book)] uppercase tracking-wider">
                Dimensões Alteradas
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-[family-name:var(--font-brevis)] text-white">
                99.7%
              </div>
              <div className="text-white/60 text-sm font-[family-name:var(--font-futura-pro-book)] uppercase tracking-wider">
                Uptime Sistema
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-white text-lg font-[family-name:var(--font-brevis)]">
                MidNight
              </h4>
              <p className="text-white/60 text-sm font-[family-name:var(--font-futura-pro-book)] max-w-xs">
                Sistema de RPG digital para campanhas de The Mental World.
                Desenvolvido para proporcionar recursos avançados de
                gerenciamento de personagens.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-lg font-[family-name:var(--font-brevis)]">
                Acesso Rápido
              </h4>
              <div className="space-y-2 text-sm">
                <div className="text-white/60 hover:text-white cursor-pointer transition-colors">
                  Dashboard Principal
                </div>
                <div className="text-white/60 hover:text-white cursor-pointer transition-colors">
                  Ficha do Personagem
                </div>
                <div className="text-white/60 hover:text-white cursor-pointer transition-colors">
                  Loja de Equipamentos
                </div>
                <div className="text-white/60 hover:text-white cursor-pointer transition-colors">
                  Status Mental
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-lg font-[family-name:var(--font-brevis)]">
                Sistema
              </h4>
              <div className="space-y-2 text-sm">
                <div className="text-white/60">Versão: {APP_VERSION}</div>
                <div className="text-white/60">
                  Status: <span className="text-green-400">Operacional</span>
                </div>
                <div className="text-white/60">
                  Último Sync: 28/06/2025 14:32
                </div>
                <div className="text-white/60">Clearance: ÔMEGA</div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/40 text-xs font-[family-name:var(--font-futura-pro-book)]">
              © 2025 MidNight Blue. Todos os direitos reservados. Sistema
              classificado sob Protocolo Mental World.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

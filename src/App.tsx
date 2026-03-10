import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  Users,
  Smartphone,
  Star,
  AlertTriangle,
  Check,
  ChevronDown,
  Shield,
  HeartPulse,
  Stethoscope,
  FileText,
  Activity,
  MessageCircle
} from "lucide-react";

const FloatingPlayButton = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300 z-20">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)] border-4 border-white/20">
      <div className="w-0 h-0 border-t-[10px] md:border-t-[14px] border-t-transparent border-l-[18px] md:border-l-[24px] border-l-white border-b-[10px] md:border-b-[14px] border-b-transparent ml-1.5" />
    </div>
  </div>
);

const VideoPlayer = ({ src, poster, priority = false }: { src: string; poster?: string; priority?: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVimeo = src.includes("vimeo.com");
  const vimeoId = isVimeo ? src.split("/").pop()?.split("?")[0] : null;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && videoRef.current && !isVimeo) {
      videoRef.current.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
  }, [isPlaying, isVimeo]);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 my-6 group cursor-pointer bg-slate-900">
      {!isPlaying && (
        <>
          <div className="absolute inset-0 bg-slate-950/20 z-10 transition-colors group-hover:bg-slate-950/10" onClick={handlePlay} />
          <FloatingPlayButton />
          {poster && (
            <img
              src={poster}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover z-0"
              loading={priority ? "eager" : "lazy"}
              onClick={handlePlay}
            />
          )}
        </>
      )}

      {isVimeo ? (
        isPlaying ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            title="Video"
          />
        ) : null
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={src}
          poster={poster}
          controls={isPlaying}
          playsInline
          preload={priority ? "auto" : "metadata"}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

const VideoPlaceholder = ({ title }: { title: string }) => (
  <div className="relative w-full aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 flex items-center justify-center group cursor-pointer my-6">
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
    <FloatingPlayButton />
    <div className="absolute bottom-4 left-4 right-4 text-center z-10">
      <span className="text-white/90 text-xs md:text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
        {title}
      </span>
    </div>
  </div>
);

// Contador regressivo até meia-noite
const CountdownTimer = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 999);
      const diff = Math.max(0, midnight.getTime() - now.getTime());
      return {
        hours: Math.floor(diff / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      };
    };
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const units = [
    { value: timeLeft.hours, label: "h" },
    { value: timeLeft.minutes, label: "m" },
    { value: timeLeft.seconds, label: "s" },
  ];

  const boxCls =
    variant === "dark"
      ? "bg-slate-800 border border-amber-500/40 text-amber-300"
      : "bg-white/20 border border-white/40 text-white";

  return (
    <div className="flex items-center gap-1 font-mono">
      {units.map(({ value, label }, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && <span className="font-black opacity-50 text-xs mx-0.5">:</span>}
          <span className={`${boxCls} rounded px-2 py-0.5 font-black text-sm backdrop-blur-sm`}>
            {pad(value)}
          </span>
          <span className="text-[10px] opacity-70 ml-0.5">{label}</span>
        </span>
      ))}
    </div>
  );
};

const FAQ_ITEMS = [
  {
    q: "Qual é o período de carência do plano?",
    a: "Para os benefícios funerários, a carência é de 90 dias a partir da data de adesão. Para os benefícios em vida — como telemedicina, desconto em exames e consultas — o acesso é imediato, a partir do primeiro mês.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Não há fidelidade obrigatória. Se desejar cancelar, basta entrar em contato com nossa equipe com antecedência e o cancelamento é feito sem burocracia ou multas.",
  },
  {
    q: "O plano cobre apenas em Irecê ou em toda a Bahia?",
    a: "O plano cobre toda a Bahia. O translado funerário está incluso para qualquer cidade do estado (no Plano Rubi é ilimitado; no Esmeralda, até 300 km; no Diamante, até 500 km). A telemedicina funciona de qualquer lugar do Brasil.",
  },
  {
    q: "Como funciona a telemedicina? Precisa baixar algum aplicativo?",
    a: "É bem simples. Basta acessar o portal da telemedicina pelo celular ou computador, informar seu nome e CPF cadastrado na Bahia Prev, e em minutos um médico estará disponível para atendê-lo. Não há necessidade de instalar nenhum aplicativo — tudo funciona pelo navegador.",
  },
  {
    q: "A taxa de adesão é paga só uma vez?",
    a: "Sim, a taxa de adesão é única, paga apenas no momento da contratação. Após isso, você paga somente a mensalidade do plano escolhido, sem cobranças surpresa.",
  },
  {
    q: "Posso incluir dependentes a qualquer hora?",
    a: "A inclusão de dependentes deve ser feita no momento da adesão ou mediante solicitação formal à equipe Bahia Prev. Em caso de novos membros da família (nascimentos, casamentos), entre em contato para verificar as condições de inclusão sem nova carência.",
  },
  {
    q: "O que acontece se eu atrasar o pagamento um mês?",
    a: "Existe um prazo de tolerância. Em caso de inadimplência, seu plano entra em suspensão e os benefícios ficam temporariamente indisponíveis. Ao regularizar o pagamento, o plano é reativado. Não há cobrança de multa abusiva — somente os valores em atraso.",
  },
  {
    q: "O valor da mensalidade pode aumentar?",
    a: "Como todo seguro ou plano assistencial, pode haver reajustes anuais de acordo com índices regulatórios. A Bahia Prev comunica os reajustes com antecedência e de forma transparente, garantindo que você sempre saiba o que está pagando.",
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
              ? "border-blue-500/50 bg-blue-500/5"
              : "border-slate-700/60 hover:border-slate-600"
              }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
            >
              <span
                className={`font-semibold text-sm md:text-base leading-snug transition-colors duration-200 ${isOpen ? "text-blue-300" : "text-slate-200 group-hover:text-white"
                  }`}
              >
                {item.q}
              </span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-400" : "text-slate-500"
                  }`}
              />
            </button>

            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? "400px" : "0px" }}
            >
              <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-700/40 pt-4">
                {item.a}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function App() {

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {/* SEÇÃO 1 — PRIMEIRA DOBRA */}
      <section className="relative bg-slate-950 text-white pt-12 pb-8 px-5 md:pt-20 md:pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center text-center">
          <motion.img
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src="/Imagens/logobahiaprev.png"
            alt="Bahia Prev Logo"
            className="h-24 md:h-32 w-auto mb-10"
            loading="eager"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-white uppercase"
          >
            Economia e <span className="text-blue-400">tranquilidade real</span> para quem você ama.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base md:text-xl text-slate-300 leading-relaxed max-w-2xl"
          >
            Proteja até 10 pessoas da sua família por <strong className="text-white font-semibold">menos de R$ 1,50 por dia</strong> com benefícios exclusivos que só a <strong className="text-white font-semibold">BAHIA PREV</strong> lhe oferece!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full mt-2"
          >
            <VideoPlayer
              src="https://vimeo.com/1170381348"
              poster="/video/thumbnailvideo1.png"
              priority={true}
            />
          </motion.div>

          <motion.a
            href="https://wa.me/5574999662787?text=Olá,%20vim%20pelo%20site%20e%20gostaria%20de%20falar%20com%20um%20consultor"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-lg md:text-xl py-4 px-8 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all duration-300 mt-4 mb-2"
          >
            <MessageCircle className="w-6 h-6" />
            Entrar em contato pelo WhatsApp
          </motion.a>

          {/* Urgência — Contador regressivo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="w-full mt-2 mb-4 rounded-2xl overflow-hidden shadow-xl shadow-red-900/40"
          >
            <div
              className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 px-5 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left"
              style={{ animation: 'urgencyPulse 3s ease-in-out infinite' }}
            >
              <span className="text-2xl">🔥</span>
              <div className="flex-1">
                <p className="text-white font-black text-sm md:text-base leading-tight">
                  Condições especiais desta página expiram <span className="text-amber-300">hoje à meia-noite</span>
                </p>
                <p className="text-red-200 text-xs mt-0.5 font-medium">
                  Após o prazo, o atendimento volta ao fluxo normal — sem garantia de vaga.
                </p>
              </div>
              <div className="shrink-0">
                <CountdownTimer />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-2 flex flex-col items-center gap-2 text-slate-400"
          >
            <p className="text-sm font-medium">Continue rolando. O que você vai ver agora pode mudar a forma como você enxerga proteção familiar.</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 opacity-70" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 2 — AUTORIDADE */}
      <section className="py-20 px-5 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto">

          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-4">
              Nossa história
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Uma empresa real.<br />
              <span className="text-blue-600">Presente na sua cidade.</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
              Mais de duas décadas cuidando de famílias no sertão da Bahia com estrutura, equipe e compromisso reais.
            </p>
          </motion.div>

          {/* Stats em linha */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-14 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white"
          >
            {[
              { icon: Star, value: "23+", label: "Anos de atuação", sub: "no mercado", color: "text-amber-500" },
              { icon: MapPin, value: "1ª", label: "Sede própria", sub: "em Irecê", color: "text-blue-600" },
              { icon: Clock, value: "24h", label: "Atendimento", sub: "todo dia", color: "text-green-600" },
              { icon: Users, value: "100%", label: "Equipe própria", sub: "treinada", color: "text-violet-600" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center p-6 md:p-8 relative group"
                style={{
                  borderRight: i < 3 ? '1px solid rgb(226 232 240)' : undefined,
                  borderBottom: i < 2 ? '1px solid rgb(226 232 240)' : undefined,
                }}
              >
                <div className={`mb-3 ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 mx-auto" />
                </div>
                <span className={`text-3xl md:text-4xl font-black ${stat.color} leading-none`}>{stat.value}</span>
                <p className="text-slate-800 font-bold text-sm mt-2 leading-tight">{stat.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* Galeria de fotos da empresa */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* Fachada — foto principal em destaque */}
            <div className="relative w-full overflow-hidden rounded-3xl shadow-lg group">
              <img
                src="/Imagens/fachada.jpeg"
                alt="Fachada da sede própria da Bahia Prev em Irecê"
                className="w-full h-72 md:h-96 object-cover object-bottom group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  <span className="text-white text-sm md:text-base font-semibold drop-shadow-lg">Sede própria — Centro Administrativo, Irecê</span>
                </div>
                <span className="hidden md:inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                  <Building className="w-3.5 h-3.5" /> Estrutura própria
                </span>
              </div>
            </div>

            {/* Recepção + Frota lado a lado */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative overflow-hidden rounded-3xl shadow-md group">
                <img
                  src="/Imagens/recepção.jpg"
                  alt="Recepção moderna da Bahia Prev"
                  className="w-full h-48 md:h-60 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-white text-xs md:text-sm font-semibold drop-shadow">Recepção</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-md group">
                <img
                  src="/Imagens/FROTA.jpg"
                  alt="Frota própria de veículos da Bahia Prev"
                  className="w-full h-48 md:h-60 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-white text-xs md:text-sm font-semibold drop-shadow">Frota própria</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-3 text-slate-400 text-sm"
          >
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Empresa regulamentada e fiscalizada — operando com transparência desde 2001</span>
          </motion.div>

          {/* Vídeo tour da empresa */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <div className="text-center mb-5">
              <p className="text-slate-500 text-sm md:text-base font-medium">
                🎥 Conheça nossa estrutura por dentro — veja tudo que a Bahia Prev preparou para cuidar da sua família.
              </p>
            </div>
            <VideoPlayer src="https://vimeo.com/1170384037" poster="/video/thumbnailvideo2.png" />
          </motion.div>

        </div>
      </section>

      {/* SEÇÃO 3 — BENEFÍCIOS EM VIDA */}
      <section className="py-20 px-5 bg-slate-950 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">

          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
              Benefícios em vida — exclusivo Bahia Prev
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              O único plano onde{" "}
              <span className="text-blue-400">os benefícios</span>
              <br className="hidden md:block" /> pagam o próprio plano.
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base md:text-lg">
              Na Bahia Prev você já usa os benefícios desde o primeiro mês — e um único uso já pode valer mais do que você pagou.
            </p>
          </motion.div>

          <VideoPlayer
            src="https://vimeo.com/1170396292"
            poster="/video/thumbnailvideo3.png"
          />

          {/* Cards de benefícios */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { icon: Smartphone, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", title: "Telemedicina 24h", desc: "Consulte um médico a qualquer hora, sem sair de casa." },
              { icon: Stethoscope, color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20", title: "Especialistas", desc: "Acesso a médicos especialistas com condições exclusivas." },
              { icon: FileText, color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", title: "Receita digital", desc: "Receitas emitidas online, sem burocracia." },
              { icon: Activity, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", title: "Desconto em exames", desc: "Economize em laboratórios e clínicas parceiras todo mês." },
              { icon: HeartPulse, color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/20", title: "Odontologia", desc: "Tratamentos dentários com desconto para toda a família." },
              { icon: Shield, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", title: "Cobertura funerária", desc: "Proteção completa quando a família mais precisa de amparo." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <p className="text-white font-bold text-lg leading-tight mb-2">{item.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Callout de economia */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-7 md:p-8 text-center shadow-2xl shadow-blue-900/40"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12" />
            <div className="relative z-10">
              <span className="text-blue-200 text-sm font-semibold uppercase tracking-widest">A conta é simples</span>
              <p className="text-white font-extrabold text-xl md:text-2xl mt-2 leading-snug">
                Uma consulta de telemedicina, um exame com desconto<br className="hidden md:block" /> o plano já se pagou.
              </p>
              <p className="text-blue-200 text-sm mt-3">Você não está comprando apenas proteção. Está investindo em algo que já retorna valor todo mês.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SEÇÃO 4 — TELEMEDICINA */}
      <section className="py-20 px-5 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto">

          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-5">
              Telemedicina inclusa
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl mx-auto">
              Saiba como fazer consultas online{" "}
              <span className="text-blue-600">sem sair de casa</span>{" "}
              com a nossa telemedicina.
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
              Em poucos cliques, você e sua família têm acesso a médicos de verdade, a qualquer hora do dia ou da noite.
            </p>
          </motion.div>

          <VideoPlayer src="https://vimeo.com/1170398626" poster="/video/thumbnailvideo4.png" />

          {/* Passo a passo */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-12"
          >
            <h3 className="text-center text-lg font-bold text-slate-900 mb-8">
              É simples assim — 3 passos e você já está em consulta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Linha conectora (desktop) */}
              <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

              {[
                { step: "1", icon: Smartphone, title: "Acesse o portal", desc: "Entre no app ou site da telemedicina com seu cadastro Bahia Prev." },
                { step: "2", icon: FileText, title: "Informe nome e CPF", desc: "Seus dados de associado já garantem o acesso gratuito." },
                { step: "3", icon: Stethoscope, title: "Inicie a consulta", desc: "Um médico atenderá você em minutos, sem filas e sem espera." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300 relative"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl mb-4 shadow-lg shadow-blue-600/25 relative z-10">
                    {item.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-slate-900 text-base mb-2">{item.title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Diferenciais */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", title: "Uso ilimitado", desc: "Consulte quantas vezes precisar, sem limites mensais." },
              { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", title: "Plantão 24h", desc: "Médicos disponíveis a qualquer hora do dia ou da noite." },
              { icon: Shield, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", title: "100% incluso", desc: "Sem cobranças extras. Já está no seu plano Bahia Prev." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.08 * i }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 group hover:border-slate-700 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} border flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{item.title}</p>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>


      {/* SEÇÃO 5 — PROVA SOCIAL */}
      <section className="py-16 px-5 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Quem já é Bahia Prev recomenda.
            </h2>
            <div className="w-16 h-1 bg-blue-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            <div className="flex flex-col">
              <span className="text-blue-400 text-xs font-bold mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Dona Iris
              </span>
              <VideoPlayer src="https://vimeo.com/1170398987" poster="/video/thumbnaildepoimento.png" />
            </div>
            <div className="flex flex-col">
              <span className="text-blue-400 text-xs font-bold mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Atendimento
              </span>
              <VideoPlayer src="https://vimeo.com/1170399197" poster="/video/thumbnaildepoimento.png" />
            </div>
            <div className="flex flex-col">
              <span className="text-blue-400 text-xs font-bold mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Experiência
              </span>
              <VideoPlayer src="https://vimeo.com/1170399315" poster="/video/thumbnaildepoimento.png" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { text: "O atendimento da telemedicina salvou minha madrugada com meu filho. Rápido e muito atencioso.", name: "Maria S." },
              { text: "A estrutura deles em Irecê é impecável. Passa muita segurança saber que são uma empresa real.", name: "João P." },
              { text: "Uso os descontos em exames com frequência. O plano se paga sozinho todo mês.", name: "Ana C." }
            ].map((dep, i) => (
              <div key={i} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-300 text-sm italic mb-4">"{dep.text}"</p>
                <p className="text-white font-semibold text-sm">— {dep.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — COMPARATIVO REAL */}
      <section className="py-20 px-5 bg-slate-50 overflow-hidden">
        <div className="max-w-4xl mx-auto">

          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-red-500 bg-red-50 border border-red-100 px-4 py-1.5 rounded-full mb-5">
              Comparativo real
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              O que acontece com a sua família{" "}
              <span className="text-red-500">quando você não está preparado?</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base md:text-lg">
              Uma perda já é devastadora emocionalmente. Não deixe que ela também destrua as finanças da família.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 items-start">

            {/* Sem proteção */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl border-2 border-red-100 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-red-400" />
              <div className="p-7 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Sem proteção</h3>
                    <p className="text-xs text-red-500 font-semibold">Situação de risco real</p>
                  </div>
                </div>

                <p className="text-slate-500 text-sm mt-4 mb-5 leading-relaxed">
                  Em caso de falecimento de um familiar <strong className="text-slate-700">sem plano</strong>, a família precisa arcar com tudo — na hora, sem planejamento:
                </p>

                <ul className="space-y-3 mb-7">
                  {[
                    { item: "Urna e preparação do corpo", valor: "R$ 1.500 – R$ 4.000" },
                    { item: "Taxas cemiteriais e sepultamento", valor: "R$ 800 – R$ 2.000" },
                    { item: "Translado (caso precise)", valor: "R$ 500 – R$ 2.500" },
                    { item: "Ornamentação e flores", valor: "R$ 300 – R$ 800" },
                    { item: "Documentação e cartório", valor: "R$ 200 – R$ 500" },
                  ].map((it, i) => (
                    <li key={i} className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="text-red-400 mt-0.5 font-bold text-sm shrink-0">✕</span>
                        <span className="text-slate-700 text-sm font-medium">{it.item}</span>
                      </div>
                      <span className="text-red-500 text-xs font-bold shrink-0 whitespace-nowrap mt-0.5">{it.valor}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-5 border-t border-red-50 bg-red-50 -mx-7 md:-mx-8 -mb-7 md:-mb-8 px-7 md:px-8 py-5 rounded-b-3xl">
                  <p className="text-sm text-slate-500 mb-1">Custo médio total à vista, sem planejamento:</p>
                  <p className="text-3xl font-black text-slate-900">Superiores a <span className="text-red-600">R$ 7.000</span></p>
                  <p className="text-xs text-slate-400 mt-1.5">Pagos de uma só vez, geralmente no pior momento da vida.</p>
                </div>
              </div>
            </motion.div>

            {/* Com Bahia Prev */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl relative overflow-hidden shadow-2xl shadow-blue-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500" />
              <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10" />

              <div className="relative z-10 p-7 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Cliente Bahia Prev</h3>
                    <p className="text-xs text-blue-200 font-semibold">Proteção completa e tranquilidade</p>
                  </div>
                </div>

                <p className="text-blue-100 text-sm mt-4 mb-5 leading-relaxed">
                  Com o plano Bahia Prev, <strong className="text-white">tudo já está resolvido</strong> — e você ainda aproveita benefícios em vida todo mês:
                </p>

                <ul className="space-y-3 mb-7">
                  {[
                    "Cobertura funerária completa (urna, preparação, velório)",
                    "Translado para qualquer cidade da Bahia",
                    "Ornamentação e flores inclusas",
                    "Telemedicina 24h ilimitada",
                    "Descontos em exames e consultas",
                    "Receita digital sem sair de casa",
                    "Odontologia com desconto para a família",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-blue-50">
                      <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-5 border-t border-blue-500/40 bg-blue-800/30 -mx-7 md:-mx-8 -mb-7 md:-mb-8 px-7 md:px-8 py-5 rounded-b-3xl backdrop-blur-sm">
                  <p className="text-blue-200 text-sm mb-1">Investimento mensal a partir de:</p>
                  <p className="text-3xl font-black text-white">Menos de <span className="text-green-300">R$ 1,50</span> <span className="text-lg font-medium text-blue-200">/dia</span></p>
                  <p className="text-xs text-blue-300 mt-1.5">Proteção para até 10 pessoas da mesma família.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Âncora de decisão */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 p-6 rounded-3xl bg-slate-900 text-center border border-slate-800"
          >
            <p className="text-white font-extrabold text-lg md:text-xl">
              R$ 7.000 pagos na hora da dor ou <span className="text-blue-400">R$ 1,50 por dia</span> com tranquilidade.
            </p>
            <p className="text-slate-400 text-sm mt-2">A escolha parece óbvia. A questão é: sua família está protegida hoje?</p>
          </motion.div>

        </div>
      </section>


      {/* SEÇÃO 7 — PLANOS */}
      <section className="py-20 px-5 bg-slate-950 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-700/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
              Escolha o seu plano
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Proteção real. <span className="text-blue-400">Preço justo.</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base md:text-lg">
              Planos que cabem no bolso e protegem quem você mais ama — com benefícios que você já usa hoje.
            </p>
          </motion.div>

          {/* Urgência nos planos */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
          >
            <span className="text-2xl shrink-0">⏰</span>
            <p className="text-slate-200 font-semibold text-sm md:text-base flex-1">
              Escolha seu plano agora — vagas com estas condições válidas{" "}
              <span className="text-amber-400 font-bold">somente hoje</span>.
            </p>
            <div className="shrink-0">
              <CountdownTimer variant="dark" />
            </div>
          </motion.div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 items-start">

            {/* Plano Esmeralda */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl bg-white/5 border border-white/10 p-7 flex flex-col hover:border-emerald-400/40 hover:bg-white/8 transition-all duration-300 group"
            >
              {/* Header do plano */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-2xl">
                  💚
                </div>
                <div>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Esmeralda</p>
                  <p className="text-white font-bold text-lg leading-tight">Família pequena</p>
                </div>
              </div>

              {/* Preço */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-400 text-base font-bold">R$</span>
                  <span className="text-6xl font-black text-white tracking-tighter">40</span>
                  <span className="text-slate-400 font-bold">/mês</span>
                </div>
                <p className="text-emerald-400 text-sm font-semibold mt-1">≈ R$ 1,33 por dia</p>
              </div>

              <div className="w-full h-px bg-white/10 my-5" />

              {/* Benefícios */}
              <ul className="space-y-3 flex-grow mb-6">
                {[
                  { icon: "👨‍👩‍👧", text: "Até 6 pessoas protegidas" },
                  { icon: "🦷", text: "1 dependente c/ Odonto Grátis" },
                  { icon: "💊", text: "Telemedicina p/ 1 pessoa" },
                  { icon: "🔬", text: "Descontos em consultas e exames" },
                  { icon: "🚗", text: "Translado até 300km" },
                  { icon: "⏱️", text: "Carência de 90 dias" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* Taxa */}
              <div className="flex items-center justify-between mb-5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Taxa de adesão</span>
                <span className="text-white font-black text-sm">R$ 60,00</span>
              </div>

              {/* CTA */}
              <a
                href="https://wa.me/5574999662787?text=Olá,%20vim%20pelo%20site%20e%20gostei%20do%20plano%20Esmeralda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all duration-300 uppercase tracking-widest text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                Quero este plano
              </a>
            </motion.div>

            {/* Plano Rubi — DESTAQUE */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl relative overflow-hidden flex flex-col md:-mt-6 md:mb-6"
              style={{ animation: 'goldGlow 2s ease-in-out infinite' }}
            >
              {/* Fundo gradiente */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600" />
              <div className="absolute top-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10" />

              {/* Ribbon dourado de destaque */}
              <div className="relative z-20 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-slate-950 py-2.5 px-4 text-center font-black text-[11px] md:text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 shadow-lg">
                <span>⭐</span>
                <span>Mais Escolhido — Melhor Custo-Benefício</span>
                <span>⭐</span>
              </div>

              <div className="relative z-10 p-7 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl backdrop-blur-sm">
                    ❤️
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Rubi</p>
                    <p className="text-white font-bold text-lg leading-tight">Família completa</p>
                  </div>
                </div>

                {/* Preço */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-blue-200 text-base font-bold">R$</span>
                    <span className="text-6xl font-black text-white tracking-tighter">65</span>
                    <span className="text-blue-200 font-bold">/mês</span>
                  </div>
                  <p className="text-amber-300 text-sm font-semibold mt-1">≈ R$ 2,17 por dia para a família toda</p>
                </div>

                <div className="w-full h-px bg-white/20 my-5" />

                {/* Benefícios */}
                <ul className="space-y-3 flex-grow mb-6">
                  {[
                    { icon: "👨‍👩‍👧‍👦", text: "Até 10 pessoas protegidas" },
                    { icon: "🦷", text: "6 dependentes c/ Odonto Grátis" },
                    { icon: "💊", text: "Telemedicina p/ 2 pessoas" },
                    { icon: "🔬", text: "Descontos em consultas e exames" },
                    { icon: "🚗", text: "Translado ilimitado na Bahia" },
                    { icon: "⏱️", text: "Carência de 90 dias" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-blue-50 text-sm">
                      <span className="text-base shrink-0">{item.icon}</span>
                      <span className="font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Taxa */}
                <div className="flex items-center justify-between mb-5 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20">
                  <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Taxa de adesão</span>
                  <span className="text-white font-black text-sm">R$ 80,00</span>
                </div>

                {/* CTA */}
                <a
                  href="https://wa.me/5574999662787?text=Olá,%20vim%20pelo%20site%20e%20gostei%20do%20plano%20Rubi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-black transition-all duration-300 uppercase tracking-widest text-sm text-center flex items-center justify-center gap-2 shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  Quero este plano
                </a>
              </div>
            </motion.div>

            {/* Plano Diamante */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-3xl bg-white/5 border border-white/10 p-7 flex flex-col hover:border-sky-400/40 hover:bg-white/8 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-2xl">
                  💎
                </div>
                <div>
                  <p className="text-sky-400 text-xs font-bold uppercase tracking-widest">Diamante</p>
                  <p className="text-white font-bold text-lg leading-tight">Família média</p>
                </div>
              </div>

              {/* Preço */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-400 text-base font-bold">R$</span>
                  <span className="text-6xl font-black text-white tracking-tighter">45</span>
                  <span className="text-slate-400 font-bold">/mês</span>
                </div>
                <p className="text-sky-400 text-sm font-semibold mt-1">≈ R$ 1,50 por dia</p>
              </div>

              <div className="w-full h-px bg-white/10 my-5" />

              {/* Benefícios */}
              <ul className="space-y-3 flex-grow mb-6">
                {[
                  { icon: "👨‍👩‍👧‍👦", text: "Até 8 pessoas protegidas" },
                  { icon: "🦷", text: "3 dependentes c/ Odonto Grátis" },
                  { icon: "💊", text: "Telemedicina p/ 1 pessoa" },
                  { icon: "🔬", text: "Descontos em consultas e exames" },
                  { icon: "🚗", text: "Translado até 500km" },
                  { icon: "⏱️", text: "Carência de 90 dias" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* Taxa */}
              <div className="flex items-center justify-between mb-5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Taxa de adesão</span>
                <span className="text-white font-black text-sm">R$ 70,00</span>
              </div>

              {/* CTA */}
              <a
                href="https://wa.me/5574999662787?text=Olá,%20vim%20pelo%20site%20e%20gostei%20do%20plano%20Diamante"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black transition-all duration-300 uppercase tracking-widest text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                Quero este plano
              </a>
            </motion.div>
          </div>

          {/* Faixa de confiança */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm"
          >
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /> Empresa regulamentada</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> Sem fidelidade obrigatória</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Atendimento 24h</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-violet-400" /> +23 anos de experiência</span>
          </motion.div>

        </div>
      </section>


      {/* SEÇÃO FINAL — DECISÃO */}
      <section className="py-16 md:py-24 px-5 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/family/1920/1080?blur=10')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/80" />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Sua família merece proteção. <br className="hidden md:block" />
            <span className="text-blue-400">A decisão agora é sua.</span>
          </h2>

          <div className="max-w-2xl mx-auto mb-10">
            <VideoPlayer src="https://vimeo.com/1170398786" poster="/video/thumbnailvideo6.png" />
          </div>

          <motion.a
            href="https://wa.me/5574999662787?text=olá,%20vim%20pelo%20site%20e%20quero%20contratar%20o%20plano"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-green-500 hover:bg-green-400 text-slate-950 font-bold text-lg md:text-xl py-5 px-8 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6" />
            Falar com um especialista no WhatsApp
          </motion.a>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Atendimento humano</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 24h</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Sem compromisso</span>
          </div>
        </div>
      </section>

      {/* SEÇÃO FAQ */}
      <section className="py-20 px-5 bg-slate-900 overflow-hidden">
        <div className="max-w-3xl mx-auto">

          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-400/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
              Dúvidas frequentes
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ainda tem alguma dúvida?{" "}
              <span className="text-blue-400">A gente responde.</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base">
              Reunimos as perguntas que mais recebemos antes de alguém se tornar cliente Bahia Prev.
            </p>
          </motion.div>

          {/* Acordeão */}
          <FaqAccordion />

        </div>
      </section>
    </div>
  );
}

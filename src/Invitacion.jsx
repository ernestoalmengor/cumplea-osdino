import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Music,
  VolumeX,
  MailOpen,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
} from "lucide-react";
import confetti from "canvas-confetti";

const Invitacion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Captura de parámetros de URL
  const params = new URLSearchParams(window.location.search);
  const idInvitado = params.get("id") || "";
  const familia = params.get("family") || "Familia Invitada";
  const pases = parseInt(params.get("pass") || "2"); // Aseguramos que sea número

  // NUEVOS ESTADOS PARA EL FORMULARIO
  const [showForm, setShowForm] = useState(false);
  const [confirmados, setConfirmados] = useState(pases);
  const [enviando, setEnviando] = useState(false);
  const [yaConfirmo, setYaConfirmo] = useState(false);
  const [comprobandoStatus, setComprobandoStatus] = useState(!!idInvitado);

  const fechaEvento = new Date("2026-08-01T15:00:00");
  const fotos = ["/1.png", "/2.png"];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = fechaEvento - now;
      if (difference > 0) {
        setTimeLeft({
          días: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          min: Math.floor((difference / (1000 * 60)) % 60),
          seg: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    const handleScroll = () => {
      setShowScrollUp(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (idInvitado) {
      const urlAppScript = "https://script.google.com/macros/s/AKfycbz8dBEXRWwzWcR33laXORLVPsSJR-D2gfovNwy5mtXFjMZLWUlmmN3-zbZ6CdonNp7ECA/exec";
      fetch(`${urlAppScript}?action=getStatus&id=${idInvitado}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.confirmados !== undefined && data.confirmados !== null && data.confirmados !== "") {
            setYaConfirmo(true);
          }
        })
        .catch(err => console.error("Error al obtener estado:", err))
        .finally(() => setComprobandoStatus(false));
    }
  }, [idInvitado]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMuted(false);
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.7 },
      colors: ["#4ade80", "#38bdf8", "#facc15"],
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmar = async () => {
    if (confirmados > pases) {
      alert(`La cantidad de pases asignados es de ${pases}`);
      return;
    }
    setEnviando(true);
    const urlAppScript =
      "https://script.google.com/macros/s/AKfycbz8dBEXRWwzWcR33laXORLVPsSJR-D2gfovNwy5mtXFjMZLWUlmmN3-zbZ6CdonNp7ECA/exec";

    try {
      await fetch(urlAppScript, {
        method: "POST",
        // El modo no-cors se quita para permitir validación correcta con el nuevo script
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({ id: idInvitado, familia, pasesConfirmados: confirmados }),
      });
      alert("¡Asistencia confirmada! Gracias.");
      setYaConfirmo(true);
      setShowForm(false);
    } catch (error) {
      alert("Hubo un error al confirmar.");
    }
    setEnviando(false);
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased overflow-x-hidden">
      {/* SECCIÓN 0: SOBRE INICIAL */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            exit={{ y: -1000, opacity: 0, transition: { duration: 1 } }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-green-200 to-green-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm border-4 border-green-100 relative overflow-hidden"
            >
              <img
                src="/hoja.png"
                className="absolute top-0 left-0 w-20 h-20 object-contain z-0"
              />
              <img
                src="/hoja2.png"
                className="absolute bottom-0 right-0 w-20 h-20 object-contain z-0"
              />
              <div className="relative z-10">
                <MailOpen className="w-24 h-24 mx-auto text-blue-400 mb-6" />
                <h2 className="text-3xl font-bold mb-3 text-green-600">
                  ¡Es mi cumpleaños!
                </h2>
                <p className="mb-8 text-xl text-slate-600 italic">
                  Para: {familia}
                </p>
                <button
                  onClick={handleOpen}
                  className="bg-blue-400 hover:bg-blue-500 text-white text-xl px-12 py-4 rounded-full font-black shadow-lg transition-all"
                >
                  Toca para abrir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          {/* BOTONES FLOTANTES */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="fixed bottom-5 right-5 z-40 bg-white/90 p-4 rounded-full shadow-lg backdrop-blur-sm border border-green-100 text-green-600"
          >
            {isMuted ? (
              <VolumeX size={28} />
            ) : (
              <Music className="animate-pulse" size={28} />
            )}
          </button>

          {showScrollUp && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-5 left-5 z-40 bg-blue-400 p-4 rounded-full shadow-lg text-white"
            >
              <ArrowUp size={28} />
            </button>
          )}

          {/* SECCIÓN 1: HERO & CONTEO */}
          <section className="min-h-screen flex flex-col items-center justify-start md:justify-center text-center p-4 pt-12 md:p-6 bg-gradient-to-b from-green-200 to-green-50 relative overflow-hidden">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full max-w-2xl relative"
            >
              <span className="text-lg md:text-2xl font-semibold text-green-800 bg-white/70 px-4 py-1 md:px-6 md:py-2 rounded-full shadow-inner border border-green-100">
                ¡Te invito a mi fiesta!
              </span>
              <h1 className="text-6xl md:text-9xl font-black text-green-500 my-4 md:my-6 drop-shadow-md">
                ¡Cumpleaños de Ale!
              </h1>
              <p className="text-xl md:text-3xl text-slate-700 mb-6 px-2">
                Mis papis{" "}
                <span className="font-bold text-blue-500">
                  Juan Manuel y María Alejandra
                </span>{" "}
                y yo te invitamos a mi{" "}
                <span className="text-3xl md:text-4xl font-black text-blue-400">
                  2do
                </span>{" "}
                cumpleaños.
              </p>

              <div className="relative flex items-center justify-center h-[200px] md:h-[350px] mt-4">
                <motion.img
                  src="/dino1.png"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute left-[-20px] md:left-[-50px] w-[180px] md:w-[350px] object-contain z-0"
                />
                <div className="flex flex-col items-center justify-center gap-1 scale-90 md:scale-110 z-10 relative ml-24 md:ml-40">
                  <span className="text-3xl md:text-5xl font-black text-green-600 uppercase">
                    Agosto
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className="h-[2px] bg-slate-700 w-12 opacity-50 mb-2" />
                      <span className="text-blue-400 font-black text-xs uppercase">
                        Sabado
                      </span>
                      <div className="h-[2px] bg-slate-700 w-12 opacity-50 mt-2" />
                    </div>
                    <span className="text-6xl md:text-9xl font-black text-blue-400 leading-none">
                      01
                    </span>
                    <div className="flex flex-col items-center">
                      <div className="h-[2px] bg-slate-700 w-12 opacity-50 mb-2" />
                      <span className="text-blue-400 font-black text-xs uppercase">
                        2026
                      </span>
                      <div className="h-[2px] bg-slate-700 w-12 opacity-50 mt-2" />
                    </div>
                  </div>
                  <span className="text-3xl md:text-5xl font-black text-green-600 mt-1">
                    03:00 PM
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CONTADOR */}
            <div className="flex justify-center gap-2 mt-12 w-full overflow-visible">
              {Object.entries(timeLeft).map(([label, value], index) => (
                <motion.div
                  key={label}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + index, repeat: Infinity }}
                  className={`relative flex flex-col items-center justify-center w-[75px] h-[75px] md:w-36 md:h-36 rounded-full shadow-lg ${index % 2 === 0 ? "bg-green-400 text-white" : "bg-blue-400 text-white"} border-2 border-white`}
                >
                  <span className="text-2xl md:text-5xl font-black leading-none">
                    {String(value ?? 0).padStart(2, "0")}
                  </span>
                  <span className="text-[8px] md:text-xs font-black uppercase mt-1">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SECCIÓN 2: CALENDARIO Y ASISTENCIA */}
          <section
            className="min-h-screen flex items-center py-12 px-4 relative overflow-hidden"
            style={{
              backgroundImage: "url('/fondo.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-blue-100/40 backdrop-blur-sm" />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={sectionVariants}
              className="max-w-5xl mx-auto w-full relative z-10 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-slate-800 flex items-center justify-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" /> ¡Aparta la fecha!
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-white/90 p-6 md:p-10 rounded-3xl shadow-2xl border-4 border-dashed border-blue-200">
                  <h4 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600 uppercase">
                    Agosto 2026
                  </h4>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
                      <div key={i} className="font-bold text-slate-400 text-xs">
                        {d}
                      </div>
                    ))}
                    {[...Array(31)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 w-8 md:h-12 md:w-12 flex items-center justify-center mx-auto font-semibold rounded-full ${i + 1 === 1 ? "bg-green-500 text-white font-black shadow-lg" : "text-slate-700 hover:bg-green-50"}`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/95 p-8 rounded-3xl shadow-xl flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    ¡Es un placer Invitarlos!
                  </h2>
                  <p className="text-lg text-slate-600 mb-3 italic">
                    Familia {familia}
                  </p>
                  <p className="text-sm md:text-lg mb-6 leading-relaxed">
                    He reservado{" "}
                    <span className="text-xl md:text-2xl font-black text-green-600">
                      {pases} pases
                    </span>{" "}
                    para ti. Por favor, confirma tu asistencia.
                  </p>
                  {comprobandoStatus ? (
                    <div className="w-full text-center py-4 text-slate-500 italic font-medium">
                      Verificando estado...
                    </div>
                  ) : yaConfirmo ? (
                    <div className="w-full bg-green-100 text-green-700 font-black py-4 rounded-2xl text-center border-2 border-green-200 shadow-inner">
                      ¡Tu asistencia ya ha sido confirmada!
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
                    >
                      Confirmar asistencia
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECCIÓN 3: UBICACIÓN */}
          <section className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={sectionVariants}
              className="max-w-4xl w-full text-center relative z-10"
            >
              <PartyPopper
                size={48}
                className="text-blue-500 animate-bounce mx-auto mb-6"
              />
              <h2 className="text-4xl md:text-5xl font-black mb-10">
                ¿Dónde es la fiesta?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/70 backdrop-blur-md p-8 rounded-[35px] border-2 border-blue-200 shadow-xl">
                  <h4 className="font-bold text-xl mb-3 text-blue-600 uppercase">
                    Hora y Lugar
                  </h4>
                  <p className="text-3xl font-black">3:00 PM</p>
                  <p className="text-slate-600 mt-2">
                    Salón Jardín Las Luces, Antigua Guatemala
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-md p-8 rounded-[35px] border-2 border-blue-200 shadow-xl flex flex-col items-center">
                  <h4 className="font-bold text-xl mb-3 text-blue-600 uppercase">
                    Dirección
                  </h4>
                  <p className="text-xl font-black italic">
                    Calle de los Pasos #12
                  </p>
                  <a
                    href="https://waze.com/ul?q=Jardin%20Las%20Luces%20Antigua"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md active:scale-95 transition-all"
                  >
                    <MapPin size={18} className="inline mr-2" /> VER UBICACIÓN
                  </a>
                </div>
              </div>
            </motion.div>
          </section>

          {/* SECCIÓN 4: GALERÍA */}
          <section className="px-8 min-h-screen flex flex-col justify-center bg-white">
            <h2 className="text-4xl md:text-6xl font-black text-green-500 mb-8 text-center">
              Mira cuanto he crecido
            </h2>
            <div className="max-w-md mx-auto relative w-full">
              <button
                onClick={() =>
                  setSliderIndex(
                    (prev) => (prev - 1 + fotos.length) % fotos.length,
                  )
                }
                className="absolute -left-12 top-1/2 -translate-y-1/2 text-green-500 z-20"
              >
                <ChevronLeft size={40} />
              </button>
              <div className="overflow-hidden rounded-[40px] shadow-2xl aspect-[3/4] relative z-10 border-4 border-green-50">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={sliderIndex}
                    src={fotos[sliderIndex]}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <button
                onClick={() =>
                  setSliderIndex((prev) => (prev + 1) % fotos.length)
                }
                className="absolute -right-12 top-1/2 -translate-y-1/2 text-green-500 z-20"
              >
                <ChevronRight size={40} />
              </button>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-green-50 py-10 text-center text-slate-400 border-t border-green-100">
            <p className="text-xs">
              © 2026 Desarrollado por{" "}
              <span className="font-bold text-green-500">Kevin Almengor</span>
            </p>
          </footer>
        </motion.main>
      )}

      {/* FORMULARIO MODAL (AHORA DENTRO DEL COMPONENTE) */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">¿Cuántos asistirán?</h3>
            <p className="text-slate-500 mb-6 italic font-medium">
              Asignados: {pases} pases
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setConfirmados(Math.max(1, confirmados - 1))}
                className="w-10 h-10 rounded-full bg-slate-100 text-2xl font-bold"
              >
                -
              </button>
              <span className="text-5xl font-black text-green-600 w-16">
                {confirmados}
              </span>
              <button
                onClick={() => {
                  if (confirmados < pases) setConfirmados(confirmados + 1);
                  else alert(`Solo tienes ${pases} pases asignados.`);
                }}
                className="w-10 h-10 rounded-full bg-slate-100 text-2xl font-bold"
              >
                +
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 text-slate-400 font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={enviando}
                className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all"
              >
                {enviando ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitacion;

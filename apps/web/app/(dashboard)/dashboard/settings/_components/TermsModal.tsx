"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  const { darkMode } = useDarkMode();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      scrollRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="terms-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl",
          darkMode
            ? "bg-zinc-900 border-white/10 text-zinc-200"
            : "bg-white border-gray-100 text-gray-800"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between px-6 py-4 border-b shrink-0",
            darkMode ? "border-white/10" : "border-gray-100"
          )}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-0.5">
              Legal
            </p>
            <h2
              id="terms-modal-title"
              className={cn(
                "text-lg font-bold",
                darkMode ? "text-white" : "text-gray-900"
              )}
            >
              Termos de Uso — Wradio
            </h2>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-xl transition-colors",
              darkMode
                ? "hover:bg-white/10 text-zinc-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            )}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          className="overflow-y-auto px-6 py-6 space-y-6 text-sm leading-relaxed"
        >
          <p
            className={cn(
              "text-xs",
              darkMode ? "text-zinc-500" : "text-gray-400"
            )}
          >
            Versão Beta — Vigência a partir da data de adesão à plataforma.
          </p>

          <Section title="1. Aceitação dos Termos" darkMode={darkMode}>
            <p>
              Ao acessar ou utilizar a plataforma Wradio, o usuário declara ter
              lido, compreendido e concordado com estes Termos de Uso. Caso não
              concorde com qualquer disposição, o uso da plataforma deve ser
              imediatamente interrompido.
            </p>
          </Section>

          <Section title="2. Regras de Utilização" darkMode={darkMode}>
            <p>O usuário compromete-se a utilizar a plataforma:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Exclusivamente para finalidades lícitas e compatíveis com a
                atividade médica e de saúde;
              </li>
              <li>
                Sem inserir, compartilhar ou transmitir conteúdo ilegal,
                difamatório, discriminatório ou que viole direitos de terceiros;
              </li>
              <li>
                Sem tentar acessar sistemas, dados ou áreas da plataforma sem
                autorização expressa;
              </li>
              <li>
                Respeitando as políticas de uso justo e os limites de créditos
                definidos em cada plano contratado.
              </li>
            </ul>
          </Section>

          <Section
            title="3. Proibição de Dados Identificáveis de Pacientes"
            darkMode={darkMode}
          >
            <p>
              É <strong>expressamente proibido</strong> inserir na plataforma
              quaisquer dados pessoais identificáveis de pacientes, incluindo,
              mas não se limitando a: nome, CPF, data de nascimento, prontuário,
              diagnósticos vinculados a indivíduos identificáveis ou qualquer
              outra informação que permita a identificação direta ou indireta de
              um paciente.
            </p>
            <p className="mt-2">
              O descumprimento desta cláusula sujeita o usuário às sanções
              previstas na Lei Geral de Proteção de Dados (LGPD — Lei n.º
              13.709/2018) e demais normas aplicáveis, sendo a Wradio isenta de
              qualquer responsabilidade decorrente do uso indevido.
            </p>
          </Section>

          <Section
            title="4. Responsabilidade pelo Conteúdo Inserido"
            darkMode={darkMode}
          >
            <p>
              O usuário é o único e exclusivo responsável por todo conteúdo
              inserido na plataforma, incluindo textos, dados clínicos
              desidentificados, arquivos de áudio e quaisquer outras
              informações. A Wradio não monitora, edita nem se responsabiliza
              pelo conteúdo gerado ou submetido pelos usuários.
            </p>
          </Section>

          <Section
            title="5. Limitação de Responsabilidade da Tecnologia"
            darkMode={darkMode}
          >
            <p>
              A Wradio fornece ferramentas de assistência baseadas em
              inteligência artificial como <strong>apoio</strong> à atividade
              profissional, não substituindo o julgamento clínico do
              profissional de saúde. A plataforma:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Não garante a precisão, completude ou adequação clínica das
                saídas geradas pela IA;
              </li>
              <li>
                Não se responsabiliza por decisões tomadas com base nos
                resultados da plataforma;
              </li>
              <li>
                Não assegura disponibilidade ininterrupta, especialmente durante
                a fase beta.
              </li>
            </ul>
          </Section>

          <Section
            title="6. Modelo Comercial — Créditos e Tokens"
            darkMode={darkMode}
          >
            <p>
              O acesso a determinadas funcionalidades da plataforma é condicionado
              ao consumo de créditos (tokens). As regras aplicáveis são:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Cada plano contratado inclui uma quantidade definida de créditos
                mensais, não cumulativos entre períodos salvo disposição
                contrária;
              </li>
              <li>
                Créditos adicionais podem ser adquiridos conforme disponibilidade
                na plataforma;
              </li>
              <li>
                A Wradio reserva-se o direito de ajustar o valor e a quantidade de
                créditos mediante notificação prévia ao usuário.
              </li>
            </ul>
          </Section>

          <Section title="7. Regras para Uso na Fase Beta" darkMode={darkMode}>
            <p>
              Durante a fase beta, a plataforma é disponibilizada de forma
              controlada a usuários selecionados (testers). Ao participar como
              tester, o usuário:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Compreende que a plataforma pode apresentar instabilidades,
                erros e funcionalidades incompletas;
              </li>
              <li>
                Concorda em fornecer feedbacks relevantes para a melhoria do
                produto quando solicitado;
              </li>
              <li>
                Compromete-se a não divulgar publicamente funcionalidades,
                interfaces ou resultados da plataforma sem autorização prévia e
                expressa da Wradio;
              </li>
              <li>
                Reconhece que as condições comerciais vigentes durante a fase
                beta podem ser alteradas no lançamento da versão estável.
              </li>
            </ul>
          </Section>

          <Section
            title="8. Propriedade Intelectual"
            darkMode={darkMode}
          >
            <p>
              Todos os direitos sobre a plataforma, incluindo marca, código-fonte,
              modelos de IA, design e demais elementos, são de propriedade
              exclusiva da Wradio. O usuário não adquire qualquer direito de
              propriedade intelectual pelo uso da plataforma.
            </p>
          </Section>

          <Section title="9. Alterações e Vigência" darkMode={darkMode}>
            <p>
              A Wradio pode atualizar estes Termos a qualquer momento. Alterações
              relevantes serão comunicadas por e-mail ou notificação dentro da
              plataforma. O uso continuado após a notificação implica aceitação dos
              novos termos.
            </p>
          </Section>

          <Section title="10. Foro" darkMode={darkMode}>
            <p>
              Fica eleito o foro da Comarca de São Paulo — SP para dirimir
              quaisquer controvérsias decorrentes destes Termos, com renúncia a
              qualquer outro, por mais privilegiado que seja.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "px-6 py-4 border-t shrink-0 flex justify-end",
            darkMode ? "border-white/10" : "border-gray-100"
          )}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Section({
  title,
  children,
  darkMode,
}: {
  title: string;
  children: React.ReactNode;
  darkMode: boolean;
}) {
  return (
    <div className="space-y-2">
      <h3
        className={cn(
          "font-semibold text-sm",
          darkMode ? "text-white" : "text-gray-900"
        )}
      >
        {title}
      </h3>
      <div className={cn(darkMode ? "text-zinc-400" : "text-gray-600")}>
        {children}
      </div>
    </div>
  );
}

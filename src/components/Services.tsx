
import { BarChart3, CloudCog, Users, Database, Shield, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: <CloudCog className="h-10 w-10 text-brand-light" />,
      title: "Hospedagem em nuvem e suporte em loco e remoto",
      description: "Soluções completas de hospedagem com suporte técnico presencial e à distância para manter seus sistemas funcionando sem interrupções."
    },
    {
      icon: <Users className="h-10 w-10 text-brand-light" />,
      title: "Consultoria Especializada na Atenção Primária",
      description: "Consultoria completa para gestão da rede de saúde da atenção primária, com foco em resultados e otimização de processos."
    },
    {
      icon: <Laptop className="h-10 w-10 text-brand-light" />,
      title: "Treinamento em sistemas para os profissionais de saúde",
      description: "Capacitação para uso eficiente do E-SUS AB e outros sistemas do DATASUS, com foco na compreensão dos indicadores de desempenho."
    },
  ];

  return (
    <>
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white pointer-events-none"></div>
        
        <div className="container mx-auto relative z-10 container-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-heading">
              <span className="gradient-text">Consultoria Sistemas DATASUS / Assessoria E-Sus AB</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Oferecemos consultoria completa para a rede de saúde da atenção primária, abrangendo todos os aspectos necessários para otimizar o desempenho dos sistemas e equipes.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Solução de problemas do sistema E-Sus AB</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Treinamento de Agente Comunitário de Saúde</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Business intelligence gratuito para acompanhamento dos indicadores do Previne</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Implantação e assessoria do Sistema E-Sus AB</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Integração do prontuário às unidades de saúde do município</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Hospedagem em Nuvem</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Capacitação dos profissionais de saúde</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Consultoria nos sistemas E-SUS AB, CNES, FPO, BPA, CADSUS</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Acompanhamento do envio de produções ao Ministério da Saúde</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="min-w-5 mt-1 text-brand-light">•</div>
                  <p>Indicadores de desempenho, financiamento APS, capitação ponderada, Previne Brasil</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button className="bg-brand-gradient hover:opacity-90 transition-opacity">
                Saber Mais
              </Button>
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-heading">
              Nossos <span className="gradient-text">Serviços</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Oferecemos um conjunto completo de ferramentas e serviços para transformar 
              a maneira como você gerencia sua instituição de saúde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="glass-card rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-brand-light/10">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <Button variant="outline" className="w-full border-brand-light text-brand-dark hover:bg-brand-light/10">
                  Ver Mais
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto container-padding">
          <div className="glass-card rounded-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Deixe com a gente</h2>
            <p className="text-gray-600 text-lg text-center">
              Com a nossa equipe de consultores, iremos realizar uma consultoria completa na sua rede de Atenção Básica e hospitalar, 
              com profissionais qualificados, proporcionando ao município um excelente desempenho nas exigências do Ministério da Saúde.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;

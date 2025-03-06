
import { BarChart3, AreaChart, PieChart, Database, Shield, Laptop } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Database className="h-8 w-8 text-brand-light" />,
      title: "Sistemas Integrados",
      description: "Plataformas completas para gestão de informações, processos e recursos em saúde e educação."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-brand-light" />,
      title: "Monitoramento de Dados",
      description: "Acompanhamento em tempo real de indicadores estratégicos para tomada de decisões precisas."
    },
    {
      icon: <AreaChart className="h-8 w-8 text-brand-light" />,
      title: "Análise Preditiva",
      description: "Previsões baseadas em dados históricos para planejamento estratégico e antecipação de cenários."
    },
    {
      icon: <Shield className="h-8 w-8 text-brand-light" />,
      title: "Gestão de Segurança",
      description: "Proteção de dados sensíveis e conformidade com legislações de privacidade e segurança."
    },
    {
      icon: <Laptop className="h-8 w-8 text-brand-light" />,
      title: "Consultoria Especializada",
      description: "Orientação técnica para implementação e otimização de processos de gestão."
    },
    {
      icon: <PieChart className="h-8 w-8 text-brand-light" />,
      title: "Dashboards Personalizados",
      description: "Visualizações customizadas para acompanhamento de métricas específicas do seu negócio."
    }
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10 container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-heading">
            Nossas <span className="gradient-text">Soluções</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Oferecemos um conjunto completo de ferramentas e serviços para transformar 
            a maneira como você gerencia sua instituição.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="glass-card rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-brand-light/10">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

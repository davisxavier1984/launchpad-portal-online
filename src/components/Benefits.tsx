
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Benefits = () => {
  const benefitsList = [
    "Redução de até 40% no tempo de processamento de informações",
    "Aumento significativo na precisão dos dados gerenciais",
    "Conformidade com legislações de proteção de dados",
    "Otimização de recursos e redução de custos operacionais",
    "Tomada de decisões baseadas em dados concretos e atualizados",
    "Maior transparência nos processos de gestão"
  ];

  const features = [
    {
      title: "Sistemas Robustos para Gestão em Saúde",
      description: "Soluções completas para hospitais, clínicas e gestores públicos de saúde"
    },
    {
      title: "Plataformas para Gestão Educacional",
      description: "Ferramentas integradas para instituições de ensino e secretarias de educação"
    },
    {
      title: "Análise Avançada de Dados",
      description: "Transforme grandes volumes de informações em insights estratégicos"
    }
  ];

  return (
    <section id="benefits" className="py-24 relative overflow-hidden section-scale">
      <div className="absolute top-0 right-0 w-full h-full transform">
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-light/5 blur-3xl"></div>
        <div className="absolute top-0 -left-32 w-96 h-96 rounded-full bg-brand-medium/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10 container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="section-heading">
              Por que escolher a <span className="gradient-text">Mais Gestor</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Nossa equipe de especialistas está comprometida em entregar soluções 
              que realmente fazem a diferença para sua organização.
            </p>
            
            <div className="space-y-4 mb-8">
              {benefitsList.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start"
                >
                  <CheckCircle className="h-6 w-6 text-brand-light flex-shrink-0 mr-3 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            
            <Button className="bg-brand-gradient hover:opacity-90 transition-opacity">
              Conheça Todos os Benefícios
            </Button>
          </div>
          
          <div className="relative card-zoom-scroll">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-light/20 to-brand-medium/20 rounded-3xl transform rotate-3 blur-sm"></div>
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6">Principais Diferenciais</h3>
                
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="p-6 bg-gray-50 rounded-xl hover:bg-brand-light/5 transition-colors zoom-on-scroll"
                    >
                      <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-5 bg-brand-gradient rounded-xl text-white">
                  <p className="font-medium">
                    "A Mais Gestor transformou completamente nossa capacidade de análise e 
                    gestão de dados, permitindo decisões mais ágeis e precisas."
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/30"></div>
                    <div className="ml-3">
                      <p className="font-bold">Dr. Ricardo Silva</p>
                      <p className="text-sm text-white/80">Diretor de Hospital</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;

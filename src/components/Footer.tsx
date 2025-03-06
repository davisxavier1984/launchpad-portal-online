
import { ChevronRight } from "lucide-react";

const Footer = () => {
  const solutions = [
    { name: "Sistemas de Gestão", href: "#" },
    { name: "Análise de Dados", href: "#" },
    { name: "Consultoria", href: "#" },
    { name: "Segurança da Informação", href: "#" }
  ];

  const company = [
    { name: "Sobre Nós", href: "#" },
    { name: "Nossa Equipe", href: "#" },
    { name: "Carreiras", href: "#" },
    { name: "Parceiros", href: "#" }
  ];

  const resources = [
    { name: "Blog", href: "#" },
    { name: "Casos de Sucesso", href: "#" },
    { name: "Perguntas Frequentes", href: "#" },
    { name: "Políticas de Privacidade", href: "#" }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <img
              src="/lovable-uploads/21e70c37-e204-4d4d-8e9a-0ab75565ee71.png"
              alt="Mais Gestor Logo"
              className="h-12 mb-6"
            />
            <p className="text-gray-600 mb-6 max-w-md">
              Desenvolvemos soluções inovadoras para gestão em saúde e educação, 
              transformando dados em estratégias para o sucesso da sua instituição.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white hover:bg-brand-light/10 rounded-full flex items-center justify-center border border-gray-200 transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  {/* Placeholder para ícones de redes sociais */}
                  <div className="w-5 h-5 bg-brand-light rounded"></div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Soluções</h3>
            <ul className="space-y-4">
              {solutions.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-600 hover:text-brand-medium flex items-center group"
                  >
                    <ChevronRight className="h-4 w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-brand-light" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Empresa</h3>
            <ul className="space-y-4">
              {company.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-600 hover:text-brand-medium flex items-center group"
                  >
                    <ChevronRight className="h-4 w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-brand-light" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Recursos</h3>
            <ul className="space-y-4">
              {resources.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-gray-600 hover:text-brand-medium flex items-center group"
                  >
                    <ChevronRight className="h-4 w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-brand-light" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Mais Gestor. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-brand-medium text-sm">
              Termos de Uso
            </a>
            <a href="#" className="text-gray-500 hover:text-brand-medium text-sm">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-500 hover:text-brand-medium text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

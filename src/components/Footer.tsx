
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const solutions = [
    { name: "Consultoria E-SUS AB", href: "#" },
    { name: "Hospedagem em Nuvem", href: "#" },
    { name: "Treinamento", href: "#" },
    { name: "Suporte Técnico", href: "#" }
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
              className="h-20 mb-6"
            />
            <p className="text-gray-600 mb-6 max-w-md">
              Desenvolvemos soluções inovadoras para gestão em saúde e educação, 
              transformando dados em estratégias para o sucesso da sua instituição.
            </p>
            
            <div className="space-y-3 mb-6">
              <p className="flex items-start">
                <Mail className="h-5 w-5 text-brand-medium mr-2 flex-shrink-0 mt-1" />
                <a href="mailto:suportemaisgestor@gmail.com" className="text-brand-medium hover:underline">
                  suportemaisgestor@gmail.com
                </a>
              </p>
              <p className="flex items-start">
                <Phone className="h-5 w-5 text-brand-medium mr-2 flex-shrink-0 mt-1" />
                <span>
                  <a href="tel:+557133511964" className="hover:underline">(71) 3351-1964</a>
                  <br />
                  <a href="tel:+5571999891993" className="hover:underline">(71) 99989-1993</a> (WhatsApp)
                </span>
              </p>
              <p className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-medium mr-2 flex-shrink-0 mt-1" /> 
                <span>Avenida Vasco da Gama, 830 - Edif Moka Sala 202<br />
                Horto Florestal, Salvador - BA, 40295-000</span>
              </p>
              <div>
                <p className="font-semibold mb-1">Horário de atendimento:</p>
                <p>Segunda a Sexta: 8:00 - 17:30</p>
                <p>Sábado e Domingo: Fechado</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white hover:bg-brand-light/10 rounded-full flex items-center justify-center border border-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-medium">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://wa.me/5571999891993"
                className="w-10 h-10 bg-white hover:bg-brand-light/10 rounded-full flex items-center justify-center border border-gray-200 transition-colors"
                aria-label="WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-medium">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
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

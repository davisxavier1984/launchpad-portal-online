
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui iria o código para enviar o formulário
    console.log("Form submitted:", formData);
    // Reseta o formulário após envio
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
    // Aqui poderia mostrar uma mensagem de sucesso
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-brand-light" />,
      title: "Telefone",
      details: [
        { label: "(71) 3351-1964", link: "tel:+557133511964" },
        { label: "(71) 99989-1993 (WhatsApp)", link: "tel:+5571999891993" }
      ]
    },
    {
      icon: <Mail className="h-5 w-5 text-brand-light" />,
      title: "Email",
      details: [
        { label: "suportemaisgestor@gmail.com", link: "mailto:suportemaisgestor@gmail.com" }
      ]
    },
    {
      icon: <MapPin className="h-5 w-5 text-brand-light" />,
      title: "Endereço",
      details: [
        { 
          label: "Avenida Vasco da Gama, 830 - Edif Moka Sala 202, Horto Florestal, Salvador - BA, 40295-000", 
          link: "https://maps.google.com/?q=Avenida Vasco da Gama, 830, Horto Florestal, Salvador, BA, 40295-000" 
        }
      ]
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/50 pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10 container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-heading">
            Entre em <span className="gradient-text">Contato</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Estamos prontos para ajudar você a encontrar a solução perfeita para sua instituição.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-light/10 rounded-lg flex items-center justify-center mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{info.title}</h4>
                      <div className="text-gray-600">
                        {info.details.map((detail, idx) => (
                          <div key={idx}>
                            <a href={detail.link} className="hover:text-brand-medium">
                              {detail.label}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4">Nossas Redes Sociais</h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-brand-light/10 hover:bg-brand-light/20 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-light">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/5571999891993"
                    className="w-10 h-10 bg-brand-light/10 hover:bg-brand-light/20 rounded-full flex items-center justify-center transition-colors"
                    aria-label="WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-light">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Segunda - Sexta:</span>
                  <span>8:00 - 17:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado:</span>
                  <span>Fechado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingo:</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Envie sua Mensagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Como podemos ajudar você?"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <Button type="submit" className="bg-brand-gradient hover:opacity-90 transition-opacity w-full py-6">
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

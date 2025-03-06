
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
      details: "+55 (11) 1234-5678"
    },
    {
      icon: <Mail className="h-5 w-5 text-brand-light" />,
      title: "Email",
      details: "contato@maisgestor.com.br"
    },
    {
      icon: <MapPin className="h-5 w-5 text-brand-light" />,
      title: "Endereço",
      details: "Av. Paulista, 1000 - São Paulo, SP"
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
                      <p className="text-gray-600">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4">Nossas Redes Sociais</h4>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 bg-brand-light/10 hover:bg-brand-light/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      {/* Placeholder para ícones de redes sociais */}
                      <div className="w-5 h-5 bg-brand-light rounded"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Segunda - Sexta:</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado:</span>
                  <span>9:00 - 13:00</span>
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

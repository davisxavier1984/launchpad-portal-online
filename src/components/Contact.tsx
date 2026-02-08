
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(val.replace(/\s/g, "")),
      "Telefone inválido. Use o formato (00) 00000-0000"
    ),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const Contact = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (_data: ContactFormData) => {
    try {
      // TODO: Replace with real API call (Supabase function or email service)
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
      reset();
    } catch {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
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
    <section id="contact" className="py-24 relative overflow-hidden section-scale">
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
                    href="https://www.instagram.com/maisgestor/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-brand-light/10 hover:bg-brand-light/20 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Instagram da Mais Gestor"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-light">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/5571999891993"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-brand-light/10 hover:bg-brand-light/20 rounded-full flex items-center justify-center transition-colors"
                    aria-label="WhatsApp da Mais Gestor"
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
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name")}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all`}
                      placeholder="Seu nome"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setValue("phone", formatted, { shouldValidate: true });
                    }}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all`}
                    placeholder="(00) 00000-0000"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.message ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all resize-none`}
                    placeholder="Como podemos ajudar você?"
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="bg-brand-gradient hover:opacity-90 transition-opacity w-full py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
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

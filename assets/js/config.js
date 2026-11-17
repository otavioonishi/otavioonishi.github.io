/* ============================================================
   CONFIGURAÇÃO DO SITE — edite somente este arquivo
   ============================================================
   • whatsapp: DDI + DDD + número, apenas dígitos. Ex.: "5511987654321"
   • github / instagram / anaNailsLink: URLs completas (sempre https://).
   • formEndpoint (opcional): URL de um serviço de formulário
     (Formspree, Getform, Web3Forms, endpoint próprio) que receba POST JSON.
     Se preenchido, tem prioridade sobre o WhatsApp.
   • E-mail: guardado em base64 apenas para dificultar coleta automática
     por spambots. Para trocar, gere o base64 do usuário e do domínio em
     https://www.base64encode.org/ e cole nos campos abaixo.

   Enquanto whatsapp e e-mail estiverem vazios, o site avisa que o canal
   ainda não foi configurado — ele nunca simula um envio.
   ============================================================ */

window.SITE_CONFIG = {
  whatsapp: "5519991761323",

  emailUserB64: "b3RhdmlvdGVjaDg=",   /* otaviotech8 */
  emailDomainB64: "Z21haWwuY29t",     /* gmail.com  */

  github: "https://github.com/otavioonishi",
  instagram: "https://instagram.com/onishi.dev",

  formEndpoint: "",

  anaNailsLink: "https://ana-nails-suite.onrender.com/"
};

class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.forms = document.querySelectorAll("form"); // Seleciona todos os formulários
    if (this.forms.length) {
      this.init();
    }
  }

  getFormObject(form) {
    const formObject = {};
    const fields = form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value.trim();
    });
    return formObject;
  }

  validateFields(form) {
    let isValid = true;
    const fields = form.querySelectorAll("[name]");

    fields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("error");
        isValid = false;
      } else {
        field.classList.remove("error");
      }

      if (field.getAttribute("name") === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          field.classList.add("error");
          isValid = false;
        } else {
          field.classList.remove("error");
        }
      }
    });

    return isValid;
  }

  async sendForm(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector("[type='submit']");
    
    if (!this.validateFields(form)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    button.disabled = true;
    button.innerText = "Enviando...";

    try {
      const response = await fetch(this.settings.url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(this.getFormObject(form)).toString(),
      });

      if (response.ok) {
        const formData = this.getFormObject(form);
        const whatsappNumber = "5521996341960";
        const whatsappMessage = encodeURIComponent(
          `Olá, meu nome é ${formData.name || "Não informado"}. ` +
          `Meu telefone: ${formData.phone || "(Não informado)"}. ` +
          (formData.doctor ? `Agendei uma consulta com ${formData.doctor}. ` : "") +
          (formData.message ? `Mensagem: ${formData.message}` : "")
        );

        window.location.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      } else {
        console.error("Erro ao enviar:", response);
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
    } finally {
      button.disabled = false;
      button.innerText = "Enviar";
    }
  }

  init() {
    this.forms.forEach((form) => {
      form.addEventListener("submit", (event) => this.sendForm(event));
    });
  }
}

// Inicializa o script para todos os formulários
const formSubmitInstance = new FormSubmit({
  url: "https://formsubmit.co/cassiaqueirozcodelab@gmail.com",
});

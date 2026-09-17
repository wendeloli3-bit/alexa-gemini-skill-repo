# 🤖 Alexa Skill + Google Gemini (Grátis) com Memória de Contexto

Este repositório contém o código completo e pré-configurado de uma **Alexa Custom Skill** conectada ao modelo de inteligência artificial **Google Gemini 1.5 Flash (100% Gratuito)** com suporte a **Memória de Contexto Contínua** e integração por **vínculo único de conta** com dispositivos de Casa Inteligente (Tuya / Smart Life).

---

## ⚡ Como Usar (Importação Rápida no Amazon Alexa Developer Console)

1. Acesse o [Amazon Developer Console](https://developer.amazon.com/alexa/console/ask).
2. Clique em **Create Skill**.
3. Escolha o nome da sua Skill (ex: `Minha IA`).
4. Selecione **Import Skill** (ou use a opção de clonar este repositório via ASK CLI / Git).
5. Cole a URL deste repositório do GitHub:
   `https://github.com/SEU_USUARIO/alexa-gemini-skill-repo.git`
6. Vá na aba **Code**, edite a **Linha 5** do arquivo `lambda/index.js` inserindo a sua **Chave API do Gemini** (obtida gratuitamente em [aistudio.google.com](https://aistudio.google.com/)).
7. Clique em **Save** e depois em **Deploy**!

---

## 📦 Estrutura do Repositório

- `skill-package/skill.json`: Manifesto da Skill com configurações de publicação.
- `skill-package/interactionModels/custom/pt-BR.json`: Modelo de interação com Intents (`AskAIIntent`) e Slots (`AMAZON.SearchQuery`) pré-configurados em português.
- `lambda/package.json`: Dependências (`@google/generative-ai`, `ask-sdk-core`).
- `lambda/index.js`: Código-fonte principal com gerenciamento de memória no DynamoDB / Session Attributes.

---

## 🚀 Recursos
- 🧠 **Memória de Conversa:** Lembra de perguntas anteriores durante a sessão.
- 💰 **100% Gratuito:** Até 1.500 requisições diárias sem custo na Gemini API.
- 🏠 **Casa Inteligente:** Sincronização automática com dispositivos da Tuya/Smart Life vinculados à conta da Alexa.

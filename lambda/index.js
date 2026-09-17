const Alexa = require('ask-sdk-core');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ⚠️ ATENÇÃO: Insira sua chave API do Google Gemini aqui ou nas variáveis de ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "SUA_CHAVE_GEMINI_AQUI";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Assistente de Inteligência Artificial iniciado. O que você gostaria de consultar ou estudar hoje?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AskAIIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskAIIntent';
    },
    async handle(handlerInput) {
        const userQuery = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query') || "Olá";
        
        // 1. RECUPERA A MEMÓRIA DA SESSÃO ATUAL
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        let history = sessionAttributes.history || [];

        try {
            // Usa o modelo ativo e rápido Gemini 2.5 Flash (Gratuito)
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: "Você é um assistente pessoal inteligente de casa e estudos. Responda de forma direta, amigável, clara e concisa para ser lido em voz alta pela Alexa."
            });

            // 2. MONTA O HISTÓRICO DE CONTEXTO
            const chat = model.startChat({ history: history });
            const result = await chat.sendMessage(userQuery);
            const responseText = result.response.text();

            // 3. ATUALIZA O HISTÓRICO DA MENSAGEM
            history.push({ role: "user", parts: [{ text: userQuery }] });
            history.push({ role: "model", parts: [{ text: responseText }] });
            
            if (history.length > 10) history = history.slice(history.length - 10);
            
            sessionAttributes.history = history;
            attributesManager.setSessionAttributes(sessionAttributes);

            return handlerInput.responseBuilder
                .speak(responseText)
                .reprompt("Deseja perguntar algo mais?")
                .getResponse();

        } catch (error) {
            console.error("Erro na integração com o Gemini:", error);
            return handlerInput.responseBuilder
                .speak("Desculpe, ocorreu uma falha ao conectar com a inteligência artificial.")
                .getResponse();
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Você pode me fazer qualquer pergunta de estudo, pedir resumos ou controlar sua casa.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Até logo! Estarei por aqui quando precisar.')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() { return true; },
    handle(handlerInput, error) {
        console.error(`Erro: ${error.message}`);
        return handlerInput.responseBuilder
            .speak('Desculpe, não entendi. Pode repetir?')
            .reprompt('Pode repetir?')
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AskAIIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
